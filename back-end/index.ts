import { Database } from "bun:sqlite";

// 1. Configuración y base de datos
const db = new Database("medicamentos.sqlite");
const TAMANIO_PAGINA = 100;
const PAUSA_ENTRE_MEDS = 600; // milisegundos 

// Crear tabla 
db.run(`
  CREATE TABLE IF NOT EXISTS medicamentos (
    nregistro TEXT PRIMARY KEY,
    nombre TEXT,
    estado TEXT,
    receta INTEGER,
    generico INTEGER,
    principiosActivos TEXT,
    excipientes TEXT,
    viasAdministracion TEXT,
    presentaciones TEXT,
    formaFarmaceutica TEXT
  )
`);

async function descargarTodoElCatalogo() {
    let paginaActual = 1;
    let totalProcesados = 0;
    let continuar = true;

    console.log("========== Iniciando descarga ==========");

    while (continuar) {
        console.log(`\n Solicitando lista de la página ${paginaActual}...`);

        try {
            const listaUrl = `https://cima.aemps.es/cima/rest/medicamentos?pagina=${paginaActual}&tamanioPagina=${TAMANIO_PAGINA}`;
            const res = await fetch(listaUrl);
            const data = await res.json();

            const medicamentosEnPagina = data.resultados || [];

            if (medicamentosEnPagina.length === 0) {
                console.log("¡Ya no hay más páginas! Proceso terminado.");
                continuar = false;
                break;
            }

            for (const m of medicamentosEnPagina) {
                const existe = db.prepare("SELECT nregistro FROM medicamentos WHERE nregistro = ?").get(m.nregistro);

                if (existe) {
                    continue;
                }

                await guardarMedicamento(m.nregistro);
                totalProcesados++;

                await new Promise(r => setTimeout(r, PAUSA_ENTRE_MEDS));
            }

            console.log(`Página ${paginaActual} procesada. Total nuevos: ${totalProcesados}`);
            paginaActual++;

        } catch (error) {
            console.error(`Error crítico en página ${paginaActual}:`, error);
            console.log("Esperando 10 segundos antes de reintentar la página...");
            await new Promise(r => setTimeout(r, 10000));
        }
    }
}

async function guardarMedicamento(nregistro: string) {
    let intentos = 3;

    while (intentos > 0) {
        try {
            const res = await fetch(`https://cima.aemps.es/cima/rest/medicamento?nregistro=${nregistro}`);

            if (res.status === 429) {
                console.log(`API Saturada. Pausa larga de 10 seg para: ${nregistro}`);
                await new Promise(r => setTimeout(r, 10000));
                intentos--;
                continue;
            }

            if (!res.ok) throw new Error(`Status: ${res.status}`);

            const d = await res.json();

            const insert = db.prepare(`
        INSERT OR REPLACE INTO medicamentos (
          nregistro, nombre, estado, receta, generico, 
          principiosActivos, excipientes, viasAdministracion, 
          presentaciones, formaFarmaceutica
        ) VALUES ($nreg, $nom, $est, $rec, $gen, $pa, $ex, $vias, $pres, $forma)
      `);

            insert.run({
                $nreg: d.nregistro,
                $nom: d.nombre,
                $est: d.estado?.nombre || "N/A",
                $rec: d.receta ? 1 : 0,
                $gen: d.generico ? 1 : 0,
                $pa: JSON.stringify(d.principiosActivos),
                $ex: JSON.stringify(d.excipientes),
                $vias: JSON.stringify(d.viasAdministracion),
                $pres: JSON.stringify(d.presentaciones),
                $forma: d.formaFarmaceutica?.nombre || d.formaFarmaceuticaSimplificada?.nombre || "N/A"
            });

            console.log(`Guardado: ${d.nombre}`);
            return;

        } catch (e) {
            intentos--;
            console.log(`Reintentando (${3 - intentos}/3) para ${nregistro}...`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    console.error(`Falló definitivamente: ${nregistro}`);
}

descargarTodoElCatalogo();
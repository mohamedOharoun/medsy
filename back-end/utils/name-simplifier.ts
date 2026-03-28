/**
 * Simplifica el nombre largo de un medicamento manteniendo la dosis y la forma esencial.
 */
export function simplifyMedicationName(fullName: string): string {
    if (!fullName) return "";

    const input = fullName.trim();

    // 1. Extraer la dosis (ej: 500 mg, 600/300 mg, 500 mg/5 ml)
    const dosageRegex = /(\d+[\.,]?\d*(\s*[\/\-]\s*\d+[\.,]?\d*)?\s*(mg|g|ml|mcg|ui|µg|microgramos|microgramo|unidades|iu))/i;
    const dosageMatch = dosageRegex.exec(input);
    const dosage = dosageMatch ? dosageMatch[0] : "";

    // 2. Extraer la forma farmacéutica con prioridad a las más específicas/largas
    const forms = [
        "comprimidos recubiertos con película", "comprimidos recubiertos", "comprimidos efervescentes",
        "comprimidos bucodispersables", "comprimidos masticables", "comprimidos",
        "cápsulas duras", "cápsulas blandas", "cápsulas", "sobres", "granulado para suspensión",
        "granulado", "polvo", "solución oral", "solución inyectable", "solución",
        "suspensión oral", "suspensión", "gel", "crema", "pomada", "supositorios",
        "viales", "vial", "inyección", "jarabe", "gotas"
    ];

    let detectedForm = "";
    const lowerInput = input.toLowerCase();
    for (const f of forms) {
        if (lowerInput.includes(f)) {
            detectedForm = f;
            break;
        }
    }

    // 3. Obtener el nombre base (lo que está antes de la dosis o la forma)
    let cutIndex = input.length;
    if (dosageMatch) cutIndex = Math.min(cutIndex, dosageMatch.index);
    if (!dosage && detectedForm) {
        const formIndex = lowerInput.indexOf(detectedForm);
        if (formIndex !== -1) cutIndex = Math.min(cutIndex, formIndex);
    }

    let baseName = input.substring(0, cutIndex).trim();

    // Si es combinación (A/B), quedarnos con la primera sustancia para simplificar
    if (baseName.includes('/')) {
        const parts = baseName.split('/');
        baseName = (parts[0] || "").trim() || baseName;
    }

    // Limpieza de laboratorios y ruidos comunes
    const labMarkers = /\s+(PHARMA|KERN|NORMON|TEVA|CINFA|STADA|BAYER|DR\.?\s*REDDYS|DR\.REDDYS|EFG|LABORATORIOS|LABS|S\.A|LTD|MYLAN|SANDOZ)\b/gi;
    baseName = baseName.replace(labMarkers, '').trim();

    // 4. Formateo base (capitaliza palabras, excepto conectores)
    const formatWords = (text: string) => {
        return text.split(' ').filter(Boolean).map((word, index) => {
            if (index > 0 && /^(de|la|y|en|con|del)$/i.test(word)) return word.toLowerCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    };

    const formatForm = (text: string) => {
        const words = text.split(' ').filter(Boolean);
        return words.map((word, index) => {
            if (index === 0) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            return word.toLowerCase();
        }).join(' ');
    };

    const formattedBase = formatWords(baseName);
    const formattedForm = detectedForm ? formatForm(detectedForm) : "";

    // 5. Construcción del resultado final
    let result = formattedBase;

    // Solo añadir dosis si NO es un medicamento combinado
    if (dosage && !input.includes('/')) {
        result += ` ${dosage.toLowerCase()}`;
    }

    // Añadir forma con guion
    if (formattedForm) {
        result += ` - ${formattedForm}`;
    }

    return result.replace(/\s+/g, ' ').trim();
}
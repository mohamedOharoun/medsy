# Usa la imagen oficial de Bun
FROM oven/bun:latest

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package.json ./
COPY bun.lock ./

# Instala las dependencias
RUN bun install --frozen-lockfile

# Copia el resto del código
COPY . .

# Expone el puerto que usará Render
EXPOSE 3000

# Comando para iniciar la aplicación (con el sync activado si quieres)
CMD ["bun", "run", "index.ts", "--sync"]

FROM node:18.16.0-alpine

# Erstelle ein Arbeitsverzeichnis
WORKDIR /app

# Kopiere package.json und package-lock.json in das Arbeitsverzeichnis
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest des Projekts in den Container
COPY . .

# Baue TypeScript in JavaScript um
RUN npm run build

# Öffne Port 3000
EXPOSE 3000

# Starte die Anwendung (aus ./src/index.ts)
CMD ["npm", "run", "dev"]
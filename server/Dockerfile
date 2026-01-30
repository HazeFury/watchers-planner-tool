# 1. On part d'une image Node.js légère (Alpine)
FROM node:20-alpine

# 2. On définit le dossier de travail dans le conteneur
WORKDIR /usr/src/app

# 3. On copie d'abord les fichiers de dépendances (pour profiter du cache Docker)
COPY package*.json ./

# 4. On installe les dépendances
RUN npm install

# 5. On copie le reste du code source
COPY . .

# 6. On génère le client Prisma (Indispensable pour que NestJS parle à la BDD)
# Note : À chaque fois que tu changes le schema.prisma, il faudra reconstruire ou relancer ça.
RUN npx prisma generate

# 7. On expose le port (informatif)
EXPOSE 3000

# 8. Commande de démarrage en mode DEV
CMD ["npm", "run", "start:dev"]
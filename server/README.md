# API - Gestion des Surveillances d'Examens

Bienvenue sur le backend de l'application de gestion des surveillances. Cette API REST permet de gérer les utilisateurs (surveillants), les examens, les salles et les inscriptions via un système d'authentification sécurisé et hiérarchisé.

## 🛠 Stack Technique

Ce projet est construit avec des technologies modernes et robustes :

![My Skills](https://skillicons.dev/icons?i=nest,prisma,postgres,ts,docker)

* **NestJS** : Framework Node.js progressif pour construire des applications serveurs efficaces et scalables.
* **Prisma ORM** : Outil de gestion de base de données nouvelle génération (Type-safe).
* **PostgreSQL** : Base de données relationnelle (hébergée via Docker).
* **Passport & JWT** : Gestion de l'authentification via Tokens stockés dans des Cookies HttpOnly (Sécurité XSS).
* **Docker** : Pour la conteneurisation de la base de données.

---

## 📚 Modèle de Données (Base de données)

L'application repose sur 5 tables principales :

1.  **Admins** : Les administrateurs du système. Ils ont tous les droits (création d'examens, gestion des salles, etc.).
2.  **Users** : Les surveillants. Ils peuvent consulter le planning et s'inscrire aux examens.
3.  **Exams** : Les sessions d'examens (Titre, Date de début/fin, Cycle, Places disponibles).
4.  **Rooms** : Les salles physiques où se déroulent les examens.
5.  **Registrations** : Table de liaison entre `User` et `Exam`. Elle gère le statut de l'inscription et permet d'éviter les doublons ou le dépassement de quota.

---

## 🚀 Installation et Configuration

### 1. Prérequis

Assurez-vous d'avoir installé :
* Node.js (LTS recommandé)
* Docker & Docker Compose (pour la BDD)

### 2. Installation des dépendances

Depuis le dossier `/server`, executez la commande :

    npm install

### 3. Configuration des variables d'environnement

Le projet ne peut pas démarrer sans configuration.
1.  Dupliquez le fichier `server/.env.sample` et renommez le `server/.env`.
2.  Modifier la valeur des variables suivantes :

	```bash
	# Connexion à la base de données (Format Prisma)
	DATABASE_URL="postgresql://DB_USER:DB_PASSWORD@localhost:PORT/DB_NAME?schema=public"

	# Secret pour signer les tokens JWT (Mettre une phrase longue et complexe)
	JWT_SECRET="votre_secret_tres_securise_ici"

	# Configuration pour le Seed de l'Admin (Création du premier compte)
	ADMIN_EMAIL="admin@ecole.fr"
	ADMIN_PASSWORD="password_admin_securise"

	# Environnement (production ou development)
	NODE_ENV="development"
	```

### 4. Lancement de la Base de Données

Lancez le conteneur Docker PostgreSQL configuré dans le `docker-compose.yml` :

    docker-compose up -d

### 5. Migrations Prisma

Mettez à jour la structure de la base de données pour qu'elle corresponde au schéma du code :

    npx prisma migrate dev

---

## 🌱 Gestion des Données (Seeding & Nettoyage)

Des scripts sont disponibles pour peupler la base de données avec des données de test ou de configuration initiale.

### Initialisation de l'Admin
Crée le compte administrateur défini dans le `.env`. À lancer au tout début.

    npx prisma db seed

### Peuplement des Salles (Rooms)
Ajoute une liste de salles prédéfinies (Amphis, Salles de TP...) pour éviter de les saisir à la main.

    npm run seed:rooms

### Peuplement des Surveillants (Users)
Crée une dizaine d'utilisateurs fictifs (Jean Dupont, Marie Curie...) pour tester les inscriptions.

    npm run seed:users

### 🧹 Nettoyage de la Base (Reset)
Vide toutes les données (Inscriptions, Examens, Salles, Users) **sauf l'Admin**. Utile pour repartir à zéro sans tout casser.

    npm run db:clean

---

## ▶️ Démarrage du Serveur

Une fois la configuration terminée :

**Mode Développement (avec rechargement automatique) :**

    npm run start:dev

**Mode Production :**

    npm run build
    npm run start:prod

L'API sera accessible par défaut sur : `http://localhost:3333`

---

## 📡 Documentation des Endpoints API

L'API est protégée. La plupart des routes nécessitent d'être connecté (Cookie JWT).

### 🔐 Authentification (Auth)

* `POST /auth/login` : Connexion Admin (Email + Password). Renvoie un cookie HttpOnly.
* `POST /auth/login-user` : Connexion Surveillant (Email uniquement). Renvoie un cookie HttpOnly.
* `POST /auth/logout` : Déconnexion (Supprime le cookie).

### 👥 Utilisateurs (Users) - Surveillants

* `GET /users` : Liste tous les surveillants (Admin seulement).
* `GET /users/:id` : Détails d'un surveillant.
* `GET /users/me` : Détails du surveillant connectés.
* `POST /users` : Créer un surveillant.
* `PATCH /users/:id` : Modifier un surveillant.
* `DELETE /users/:id` : Supprimer un surveillant.

### 📅 Examens (Exams)

* `GET /exams` : Liste des examens (Accessible à tous les connectés).
* `GET /exams/upcoming` : Liste des examens à venir.
* `GET /exams/:id` : Détails d'un examen.
* `POST /exams` : Créer un examen (Admin).
* `PATCH /exams/:id` : Modifier un examen (Admin).
* `DELETE /exams/:id` : Supprimer un examen (Admin).

### 📝 Inscriptions (Registrations)

* `POST /registrations` : S'inscrire à un examen.
    * *User* : S'inscrit lui-même automatiquement.
    * *Admin* : Doit fournir un `userId` pour inscrire quelqu'un.
* `GET /registrations` : Voir les inscriptions.
    * *Admin* : Voit tout (avec emails).
    * *User* : Voit ses inscriptions et ses collègues (emails masqués).
* `GET /registrations/mine` : Voir les inscriptions de l'utilisateur connecté.
* `PATCH /registrations/:id` : Modifier une inscription (Salle, horaires aménagés) (Admin).
* `DELETE /registrations/:id` : Désinscrire quelqu'un (Admin).

### 🏫 Salles (Rooms)

* `GET /rooms` : Liste des salles (Accessible à tous).
* `POST /rooms` : Créer une salle (Admin).
* `PATCH /rooms/:id` : Renommer une salle (Admin).
* `DELETE /rooms/:id` : Supprimer une salle (Admin).
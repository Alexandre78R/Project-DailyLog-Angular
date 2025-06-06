# DailyLog

DailyLog est une application de journal de bord personnel permettant d’enregistrer ses humeurs quotidiennes et de visualiser des statistiques associées.  
**Le but principal de ce projet est de pratiquer et approfondir les compétences en Angular**, tout en développant un backend simple avec Express, Prisma et MySQL pour gérer les données.

## 🚀 Installation et lancement
Prérequis
- Node.js (v18+ recommandée)  
- MySQL (ou autre base compatible Prisma)  
- Angular CLI (pour le frontend)  

---

## Backend (API)

### 1) Installation des dépendances
```bash
cd API
npm install
```

### 2) Configuration des variables d’environnement :

Créer un fichier .env à la racine du dossier API avec au minimum :

### 3) Migration Prisma :
Pour créer la base de données et appliquer les migrations :
```bash
npx prisma migrate dev --name init
```
### 3) Lancer le serveur backend en mode développement :
```bash
npm run dev
```

---

## Frontend (Angular 19)

### 1) Installation des dépendances :
```bash
cd frontend
npm install
```

### 2) Configurer l’environnement :
Modifier src/environments/environment.ts pour ajouter l’URL de l’API backend :
```bash
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```
(Et faire de même dans environment.prod.ts si nécessaire)

### 3) Lancer le frontend en mode développement :
```bash
npm run dev
```

## Lancer le projet complet (frontend + backend) avec un seul script
Depuis la racine du projet DailyLog (contenant package.json global) :
```bash
npm run dev
```
Ce script utilise concurrently pour lancer simultanément le frontend et le backend.

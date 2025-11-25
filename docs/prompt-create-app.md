Tu es un expert en développement full stack. Crée une application web responsive appliquant le principe mobile-first pour la gestion des notes de frais (caisse). Voici les spécifications détaillées :

### Objectif

L’application doit permettre :

- L'enrégistrement des propriétaires des projets.
- L'enrégistrement des projets d'un propriétaire donné.
- L’enregistrement des **objets de dépense** (ex. mission, projet).
- L’ajout des **entrées financières** (sommes reçues) liées à un objet.
- L’ajout des **dépenses** effectuées pour cet objet.
- Le calcul automatique de la **balance comptable** (entrées – dépenses).
- La génération d’un **rapport comptable** affichable et exportable en **PDF** et **DOCX**.

### Fonctionnalités

1. **Authentification & Sécurité**

   - Inscription et connexion via **Firebase Authentication** avec **JWT**.
   - Protection contre **SQL Injection**, **XSS**, **CSRF**.
   - Gestion des rôles (Admin, Utilisateur).

2. **Interface utilisateur**

   - Design **sobre et épuré**, **mobile-first**.
   - **Dark/Light mode** toggle.
   - Navigation intuitive (Dashboard, Propriétaires, Projets, Objets, Entrées, Dépenses, Rapports).

3. **Gestion des données**

   - Création d’un **propriétaire de projet** (nom, description, adresse, téléphone).
   - Création d’un **projet pour un objet** (nom, description, budget initial).
   - Création d’un **objet de dépense** (nom, description, budget initial).
   - Ajout d’**entrées** (montant, date, source).
   - Ajout de **dépenses** (catégorie, montant, justificatif).
   - Calcul automatique du **solde** et du **trop perçu/trop dépensé**.

4. **Rapports**
   - Génération d’un **rapport comptable** avec :
     - Informations générales (nom, objet, budget, avances).
     - Tableau des dépenses par catégorie.
     - Résumé (total dépenses, solde, trop perçu/trop dépensé).
   - **Affichage dans le navigateur**.
   - **Export en PDF** (via `jsPDF` ou `pdfmake`).
   - **Export en DOCX**.

### Stack technologique

- **Frontend** : React.js + Vite
  - UI : TailwindCSS
  - State Management : Context API
- **Backend** : Node.js + Express
  - Base de données : MySQL (via Sequelize)
  - Sécurité : Helmet, express-validator, bcrypt
- **Authentification** : Firebase + JWT
- **PDF Export** : jsPDF ou pdfmake
- **DOCX Export** :

### Architecture

- **Frontend**
  - Pages : Login, Register, Dashboard, Propriétaires, Projets, Objets, Entrées, Dépenses, Rapports
  - Composants : Formulaires, Tableaux, Graphiques (Tableau de bord)
- **Backend**
  - Routes : `/auth`, `/owners`, `/projects`, `/objects`, `/entries`, `/expenses`, `/reports`
  - Middleware : Auth JWT, Validation, Error Handling
- **Database**
  - Tables : `users`, `owners`, `projects`, `objects`, `entries`, `expenses`, `expense_files`, `source_nature`

project-root/
│
├── frontend/ # Application React + Vite
│ ├── public/ # Fichiers statiques
│ ├── src/
│ │ ├── assets/ # Images, icônes
│ │ ├── components/ # Composants réutilisables (Button, Navbar, etc.)
│ │ ├── pages/ # Pages principales (Login, Dashboard, etc.)
│ │ ├── hooks/ # Hooks personnalisés (auth, thème)
│ │ ├── context/ # Context API (auth, thème)
│ │ ├── services/ # Appels API (Axios)
│ │ ├── styles/ # Fichiers CSS/Tailwind
│ │ ├── App.jsx # Composant racine
│ │ ├── main.jsx # Point d’entrée Vite
│ │ └── router.jsx # Routes avec React Router
│ ├── vite.config.js
│ ├── package.json
│ └── tailwind.config.js
│
├── backend/ # API Node.js + Express
│ ├── src/
│ │ ├── config/ # Config DB, Firebase, JWT
│ │ ├── controllers/ # Logique métier (auth, objects, entries, expenses)
│ │ ├── middleware/ # Auth JWT, validation, sécurité
│ │ ├── models/ # ORM Sequelize ou Prisma (User, Object, Entry, Expense)
│ │ ├── routes/ # Routes Express (auth.js, objects.js, etc.)
│ │ ├── utils/ # Fonctions utilitaires (PDF export, calcul solde)
│ │ ├── app.js # Initialisation Express
│ │ └── server.js # Point d’entrée serveur
│ ├── package.json
│ └── .env # Variables d’environnement
│
├── docs/ # Documentation technique
└── README.md

### Tables et relations

L’application gère :

- Utilisateurs (authentification)
- Propriétaires de projet
- Projets
- Objets de dépense (missions, activités)
- Entrées (sommes reçues pour un objet)
- Dépenses (sommes dépensées pour un objet)

Relations :

- Un administrateur peut créer plusieurs propriétaires.
- Un administrateur peut créer plusieurs projets.
- Un utilisateur peut créer plusieurs objets.
- Un projet peut avoir plusieurs objets.
- Un objet peut avoir plusieurs entrées et dépenses.

### Index et sécurité

- Index sur object_id dans entries et expenses pour optimiser les requêtes.
- Utilisation de prepared statements pour éviter les injections SQL.
- Ajout de contraintes NOT NULL et types adaptés pour éviter les erreurs.

### Calculs à prévoir

- Total des entrées par objet : SUM(amount) dans entries.
- Total des dépenses par objet : SUM(amount) dans expenses.
- Solde : total_entries - total_expenses.
- Trop perçu / Trop dépensé : si solde > 0 → trop perçu, sinon trop dépensé.

### Exemple de rapport (basé sur modèle fourni)

Propriétaire : Minsitère en charge des Travaux Publics
Projet : PADIG
Objet : Mission Validation APS
Avances perçues : 205 000 F CFA
Nature : Espèces ou Chèques (si chèque enrégistrer la référence du chèque)
Dépenses :

- Communication : 20 000 F CFA
- Carburant : 72 255 F CFA
- Divers : 52 400 F CFA
  Total dépenses : 144 655 F CFA
  Solde : 60 345 F CFA (Trop perçu à reverser)

### Instructions

Génère le code complet pour le **frontend** et le **backend** pour :

- Inclure la configuration Firebase pour l’authentification.
- Initialisation du projet (package.json, dépendances).
- Implémenter la logique de calcul du solde et du rapport.
- Routes, contrôleurs CRUD et services.
- Middleware JWT.
- Configuration Sequelize et modèles
- Génération PDF et DOCX avec données dynamiques
- Respecter le principe **mobile-first** et inclure le **dark/light mode**.
- Ajouter les protections contre les injections SQL, XSS, CSRF.
- Fournir la structure des dossiers et fichiers.

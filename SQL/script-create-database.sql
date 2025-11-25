
-- Créer la base
CREATE DATABASE IF NOT EXISTS caisse_app;
USE caisse_app;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des propriétaires  
CREATE TABLE owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    adress VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des projets  
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    adress VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
);

-- Table des objets de dépense
CREATE TABLE objects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    budget DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Table des entrées (sommes reçues)
CREATE TABLE entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    object_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    source VARCHAR(255),
    entry_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (object_id) REFERENCES objects(id) ON DELETE CASCADE
);

-- Table des dépenses
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    object_id INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    expense_date DATE NOT NULL,
    justification VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (object_id) REFERENCES objects(id) ON DELETE CASCADE
);

-- Table des fichiers joints aux dépenses
CREATE TABLE expense_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE
);

-- Table de la nature de la recette 
CREATE TABLE source_nature (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entry_id INT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    reference_source VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
);

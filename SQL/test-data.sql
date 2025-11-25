USE ifoura_app;

-- Insertion d'utilisateurs
INSERT INTO users (firebase_uid, email, password, role) VALUES
('firebaseuid123admin', 'admin@example.com', '$2a$10$somehashedpasswordadmin', 'Admin'),
('firebaseuid456user', 'user@example.com', '$2a$10$somehashedpassworduser', 'User');

-- Insertion de propriétaires
INSERT INTO owners (name, description, address, phone) VALUES
('Minsitère en charge des Travaux Publics', 'Organisme gouvernemental pour les infrastructures', '123 Rue Principale, Ville', '111-222-3333'),
('Entreprise Alpha', 'Société de construction', '456 Avenue des Champs, Ville', '444-555-6666');

-- Insertion de projets
INSERT INTO projects (owner_id, name, description, initial_budget) VALUES
(1, 'PADIG', 'Projet d\'Amélioration des Infrastructures Générales', 500000.00),
(1, 'Projet Routier National', 'Construction de nouvelles routes nationales', 1200000.00),
(2, 'Construction Siège Social', 'Construction du nouveau siège social de l\'entreprise', 800000.00);

-- Insertion d'objets de dépense
INSERT INTO objects (project_id, name, description, initial_budget) VALUES
(1, 'Mission Validation APS', 'Mission de validation des Avant-Projets Sommaires', 205000.00),
(1, 'Acquisition Matériel', 'Achat de matériel informatique pour le projet PADIG', 75000.00),
(2, 'Étude de Faisabilité', 'Étude de faisabilité pour le projet routier', 150000.00),
(3, 'Phase 1 - Fondations', 'Travaux de fondation pour le siège social', 300000.00);

-- Insertion d'entrées financières
INSERT INTO entries (object_id, amount, source, date) VALUES
(1, 205000.00, 'Espèces', '2025-10-20 10:00:00'),
(2, 75000.00, 'Virement Bancaire', '2025-10-25 11:30:00'),
(1, 50000.00, 'Chèque #12345', '2025-11-01 09:00:00');

-- Insertion de dépenses
INSERT INTO expenses (object_id, category, amount, date, justification) VALUES
(1, 'Communication', 20000.00, '2025-10-21 14:00:00', 'Forfaits téléphoniques'),
(1, 'Carburant', 72255.00, '2025-10-22 08:00:00', 'Déplacements mission'),
(1, 'Divers', 52400.00, '2025-10-23 16:00:00', 'Fournitures de bureau'),
(2, 'Matériel Informatique', 60000.00, '2025-10-26 10:00:00', 'Ordinateurs portables'),
(3, 'Consulting', 100000.00, '2025-11-05 11:00:00', 'Honoraires expert');

-- Create the database
CREATE DATABASE dirag_game;

-- Connect to the database
\c dirag_game

-- Create the players table
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    nom_utilisateur VARCHAR(50) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    prenom VARCHAR(50),
    nom VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the games table
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    score INTEGER NOT NULL,
    duration INTEGER, -- Duration in seconds
    date_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT false,
    nom_du_jeu VARCHAR(100) -- Nouvelle colonne ajoutée
);

-- Create an index on player_id in the games table for faster queries
CREATE INDEX idx_games_player_id ON games(player_id);

-- Create an index on score in the games table for faster high score queries
CREATE INDEX idx_games_score ON games(score DESC);


-- Désactiver temporairement la vérification des contraintes pour permettre l'insertion d'IDs spécifiques
SET session_replication_role = 'replica';

-- Insérer les joueurs
INSERT INTO players (id, nom_utilisateur, mot_de_passe, prenom, nom) VALUES
(3, 'slither_pro', 'slither123', 'Bob', 'Johnson'),
(4, 'pixel_mover', 'pixel123', 'Alice', 'Williams'),
(5, 'grid_navigator', 'grid123', 'Mike', 'Davis'),
(16, 'cleminou', 'nokia', 'clement', 'guillo'),
(20, 'titou', 'titoutitou', 'Valentine', 'Chieze')
ON CONFLICT (id) DO UPDATE
SET nom_utilisateur = EXCLUDED.nom_utilisateur,
    mot_de_passe = EXCLUDED.mot_de_passe,
    prenom = EXCLUDED.prenom,
    nom = EXCLUDED.nom;

-- Insert game records
INSERT INTO games (id, player_id, score, duration, date_time, is_active, nom_du_jeu) VALUES
(9, 5, 130, 155, '2023-04-19T08:30:00Z', false, 'snake-dirag'),
(10, 4, 110, 135, '2023-04-19T20:00:00Z', false, 'snake-dirag')
ON CONFLICT (id) DO UPDATE
SET player_id = EXCLUDED.player_id,
    score = EXCLUDED.score,
    duration = EXCLUDED.duration,
    date_time = EXCLUDED.date_time,
    is_active = EXCLUDED.is_active,
    nom_du_jeu = EXCLUDED.nom_du_jeu;


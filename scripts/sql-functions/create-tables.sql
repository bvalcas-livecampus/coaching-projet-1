DROP TABLE IF EXISTS compose CASCADE;
DROP TABLE IF EXISTS parties CASCADE;
DROP TABLE IF EXISTS belong_to CASCADE;
DROP TABLE IF EXISTS can_be CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS registered CASCADE;
DROP TABLE IF EXISTS tournament CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS class CASCADE;

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL
);

CREATE TABLE class (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(50) NOT NULL,
    label_fr VARCHAR(255) NOT NULL,
    label_en VARCHAR(255) NOT NULL
);

CREATE TABLE can_be (
    id SERIAL,
    role_id INT NOT NULL REFERENCES role(id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    class_id INT NOT NULL REFERENCES class(id),
    FOREIGN KEY (class_id) REFERENCES class(id),
    PRIMARY KEY (role_id, class_id)
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_id INT NOT NULL REFERENCES class(id),
    role_id INT NOT NULL REFERENCES role(id),
    ilvl INT CHECK (ilvl >= 0 AND ilvl <= 645),
    rio INT CHECK (rio >= 0 AND rio <= 4500),
    FOREIGN KEY (role_id, class_id) REFERENCES can_be(role_id, class_id)
);

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE belong_to (
    id SERIAL,
    player_id INT NOT NULL REFERENCES players(id),
    character_id INT NOT NULL REFERENCES characters(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (character_id) REFERENCES characters(id),
    PRIMARY KEY (player_id, character_id)
);

CREATE TABLE tournament (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

CREATE TABLE registered (
    id SERIAL PRIMARY KEY,
    registration_date TIMESTAMP NOT NULL,
    tournament_id INT NOT NULL REFERENCES tournament(id),
    FOREIGN KEY (tournament_id) REFERENCES tournament(id)
);

CREATE TABLE parties (
    id SERIAL PRIMARY KEY,
    captain_id INT NOT NULL REFERENCES characters(id),
    registered_id INT NOT NULL REFERENCES registered(id),
    FOREIGN KEY (captain_id) REFERENCES characters(id),
    FOREIGN KEY (registered_id) REFERENCES registered(id)
);

CREATE TABLE compose (
    id SERIAL,
    character_id INT NOT NULL REFERENCES characters(id),
    party_id INT NOT NULL REFERENCES parties(id),
    FOREIGN KEY (character_id) REFERENCES characters(id),
    FOREIGN KEY (party_id) REFERENCES parties(id),
    PRIMARY KEY (character_id, party_id)
);
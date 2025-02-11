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
DROP TABLE IF EXISTS donjons CASCADE;
DROP TABLE IF EXISTS donjon_done CASCADE;

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
    registered_id INT REFERENCES registered(id),
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

CREATE TABLE donjons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    timer INT NOT NULL
);

CREATE TABLE donjon_done (
    id SERIAL,
    party_id INT NOT NULL REFERENCES parties(id),
    donjon_id INT NOT NULL REFERENCES donjons(id),
    timer INT NOT NULL,
    FOREIGN KEY (party_id) REFERENCES parties(id),
    FOREIGN KEY (donjon_id) REFERENCES donjons(id),
    PRIMARY KEY (party_id, donjon_id)
);

TRUNCATE TABLE role CASCADE;

INSERT INTO role (label) VALUES
('tank'),
('damage'),
('healer'); 

TRUNCATE TABLE class CASCADE;

INSERT INTO class (identifier, label_fr, label_en) VALUES
('warrior', 'Guerrier', 'Warrior'),
('paladin', 'Paladin', 'Paladin'),
('hunter', 'Chasseur', 'Hunter'),
('rogue', 'Voleur', 'Rogue'),
('priest', 'Prêtre', 'Priest'),
('shaman', 'Chaman', 'Shaman'),
('mage', 'Mage', 'Mage'),
('warlock', 'Démoniste', 'Warlock'),
('monk', 'Moine', 'Monk'),
('druid', 'Druide', 'Druid'),
('dh', 'Chasseur de démon', 'Demon Hunter'),
('dk', 'Chevalier de la mort', 'Death Knight'),
('evoker', 'Évocateur', 'Evoker');

TRUNCATE TABLE can_be CASCADE;

-- Now insert the class-role relationships
-- Warriors (tank, damage)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'tank') FROM class WHERE identifier = 'warrior'
UNION
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'warrior';

-- Paladins (tank, damage, healer)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'tank') FROM class WHERE identifier = 'paladin'
UNION
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'paladin'
UNION
SELECT id, (SELECT id FROM role WHERE label = 'healer') FROM class WHERE identifier = 'paladin';

-- Hunters (damage only)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'hunter';

-- Rogues (damage only)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'rogue';

-- Priests (damage, healer)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'priest'
UNION
SELECT id, (SELECT id FROM role WHERE label = 'healer') FROM class WHERE identifier = 'priest';

-- Shamans (damage, healer)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'shaman'
UNION
SELECT id, (SELECT id FROM role WHERE label = 'healer') FROM class WHERE identifier = 'shaman';

-- Mages (damage only)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'mage';

-- Warlocks (damage only)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'warlock';

-- Monks (damage only)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'monk';

-- Druids (tank, damage, healer)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'tank') FROM class WHERE identifier = 'druid'
UNION
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'druid'
UNION
SELECT id, (SELECT id FROM role WHERE label = 'healer') FROM class WHERE identifier = 'druid';

-- Demon Hunters (tank, damage)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'tank') FROM class WHERE identifier = 'dh'
UNION
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'dh';

-- Death Knights (tank, damage)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'tank') FROM class WHERE identifier = 'dk'
UNION
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'dk';

-- Evokers (damage, healer)
INSERT INTO can_be (class_id, role_id)
SELECT id, (SELECT id FROM role WHERE label = 'damage') FROM class WHERE identifier = 'evoker'
UNION
SELECT id, (SELECT id FROM role WHERE label = 'healer') FROM class WHERE identifier = 'evoker'; 

TRUNCATE TABLE characters CASCADE;

INSERT INTO characters (name, class_id, role_id, ilvl, rio) VALUES
    ('Thunderfury', 1, 1, 630, 3200),    -- Warrior Tank
    ('Lightbringer', 2, 2, 625, 3100),   -- Paladin Healer
    ('Shadowstrike', 4, 2, 635, 3400),   -- Rogue DPS
    ('Naturewarden', 6, 2, 640, 3800),   -- Druid Healer
    ('Arrowmaster', 3, 2, 628, 3300);    -- Hunter DPS

INSERT INTO players (username, email, password) VALUES
    ('DragonSlayer', 'dragon.slayer@gmail.com', 'hashedpass123'),
    ('MythicRunner', 'mythic.runner@yahoo.com', 'securepass456'),
    ('LegendaryTank', 'legendary.tank@hotmail.com', 'tankpass789'),
    ('HealerPro', 'healer.pro@gmail.com', 'healpass321'),
    ('DPSMaster', 'dps.master@outlook.com', 'dpspass654');


TRUNCATE TABLE parties CASCADE;

INSERT INTO parties (captain_id, registered_id) VALUES
    (1, 1),  -- Thunderfury leads a party for April tournament
    (2, 2),  -- Lightbringer leads another party for April tournament
    (3, 3),  -- Shadowstrike leads a party for June tournament
    (4, 4),  -- Naturewarden leads another party for June tournament
    (5, 5);  -- Arrowmaster leads a party for August-September tournament


TRUNCATE TABLE compose CASCADE;

INSERT INTO compose (character_id, party_id) VALUES
    (1, 1),  -- Thunderfury in their own party
    (2, 1),  -- Lightbringer joins Thunderfury's party
    (3, 1),  -- Shadowstrike joins Thunderfury's party
    
    (2, 2),  -- Lightbringer in their own party
    (4, 2),  -- Naturewarden joins Lightbringer's party
    (5, 2),  -- Arrowmaster joins Lightbringer's party
    
    (3, 3),  -- Shadowstrike in their own party
    (4, 3),  -- Naturewarden joins Shadowstrike's party
    
    (4, 4),  -- Naturewarden in their own party
    (5, 4),  -- Arrowmaster joins Naturewarden's party
    
    (5, 5);  -- Arrowmaster in their own party


TRUNCATE TABLE belong_to CASCADE;

INSERT INTO belong_to (player_id, character_id) VALUES
    ((SELECT id FROM players WHERE username = 'DragonSlayer'), 
     (SELECT id FROM characters WHERE name = 'Thunderfury')),
    ((SELECT id FROM players WHERE username = 'HealerPro'), 
     (SELECT id FROM characters WHERE name = 'Lightbringer')),
    ((SELECT id FROM players WHERE username = 'DPSMaster'), 
     (SELECT id FROM characters WHERE name = 'Shadowstrike')),
    ((SELECT id FROM players WHERE username = 'MythicRunner'), 
     (SELECT id FROM characters WHERE name = 'Naturewarden')),
    ((SELECT id FROM players WHERE username = 'LegendaryTank'), 
     (SELECT id FROM characters WHERE name = 'Arrowmaster'));


TRUNCATE TABLE tournament CASCADE;

INSERT INTO tournament (start_date, end_date) VALUES
    ('2024-04-01', '2024-04-03'),  -- A 3-day tournament in April
    ('2024-06-15', '2024-06-16'),  -- A weekend tournament in June
    ('2024-08-30', '2024-09-02'),  -- Long weekend tournament in August-September
    ('2024-12-27', '2024-12-31');  -- End of year tournament
    
    TRUNCATE TABLE registered CASCADE;

INSERT INTO registered (registration_date, tournament_id) VALUES
    ('2024-03-15 10:30:00', 1),  -- Early registration for April tournament
    ('2024-03-20 15:45:00', 1),  -- Another registration for April tournament
    ('2024-06-01 09:00:00', 2),  -- Registration for June tournament
    ('2024-06-10 14:20:00', 2),  -- Another registration for June tournament
    ('2024-08-15 11:00:00', 3),  -- Early registration for August-September tournament
    ('2024-12-01 08:30:00', 4),  -- Early registration for end of year tournament
    ('2024-12-15 16:15:00', 4);  -- Another registration for end of year tournament

TRUNCATE TABLE players CASCADE;


INSERT INTO donjons (name, timer) VALUES
    ('The Stonevault', 33),
    ('The Dawnbreaker', 35),
    ('Ara-Kara, City of Echoes', 30),
    ('City of Threads', 38),
    ('Mists of Tirna Scithe', 30),
    ('The Necrotic Wake', 36),
    ('Siege of Boralus', 36),
    ('Grim Batol', 34);


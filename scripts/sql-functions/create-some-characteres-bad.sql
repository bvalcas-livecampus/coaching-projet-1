TRUNCATE TABLE characters CASCADE;

INSERT INTO characters (name, class_id, role_id, ilvl, rio) VALUES
    ('Thunderfury', 1, 1, 630, 3200),    -- Warrior Tank
    ('Lightbringer', 2, 2, 625, 3100),   -- Paladin Healer
    ('Shadowstrike', 4, 3, 635, 3400),   -- Rogue DPS
    ('Naturewarden', 6, 2, 640, 3800),   -- Druid Healer
    ('Arrowmaster', 3, 3, 628, 3300);    -- Hunter DPS


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

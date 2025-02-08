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

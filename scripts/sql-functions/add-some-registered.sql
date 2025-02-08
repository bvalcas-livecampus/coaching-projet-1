TRUNCATE TABLE registered CASCADE;

INSERT INTO registered (registration_date, tournament_id) VALUES
    ('2024-03-15 10:30:00', 1),  -- Early registration for April tournament
    ('2024-03-20 15:45:00', 1),  -- Another registration for April tournament
    ('2024-06-01 09:00:00', 2),  -- Registration for June tournament
    ('2024-06-10 14:20:00', 2),  -- Another registration for June tournament
    ('2024-08-15 11:00:00', 3),  -- Early registration for August-September tournament
    ('2024-12-01 08:30:00', 4),  -- Early registration for end of year tournament
    ('2024-12-15 16:15:00', 4);  -- Another registration for end of year tournament

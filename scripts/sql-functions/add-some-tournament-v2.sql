TRUNCATE TABLE tournament CASCADE;

INSERT INTO tournament (start_date, end_date, name, cost_to_registry, description) VALUES
    ('2024-04-01', '2024-04-03', 'Spring Championship', 50, 'A 3-day competitive tournament featuring the best teams of the season'),
    ('2024-06-15', '2024-06-16', 'Summer Weekend Clash', 25, 'An intense weekend of mythic dungeon racing'),
    ('2024-08-30', '2024-09-02', 'Labor Day Marathon', 75, 'Extended holiday weekend tournament with increased prize pool'),
    ('2024-12-27', '2024-12-31', 'New Year''s Challenge', 100, 'End the year with the most prestigious tournament of the season');
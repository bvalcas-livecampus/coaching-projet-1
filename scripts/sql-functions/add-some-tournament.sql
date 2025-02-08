TRUNCATE TABLE tournament CASCADE;

INSERT INTO tournament (start_date, end_date) VALUES
    ('2024-04-01', '2024-04-03'),  -- A 3-day tournament in April
    ('2024-06-15', '2024-06-16'),  -- A weekend tournament in June
    ('2024-08-30', '2024-09-02'),  -- Long weekend tournament in August-September
    ('2024-12-27', '2024-12-31');  -- End of year tournament
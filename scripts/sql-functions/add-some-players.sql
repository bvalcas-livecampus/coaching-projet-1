TRUNCATE TABLE players CASCADE;

INSERT INTO players (username, email, password) VALUES
    ('DragonSlayer', 'dragon.slayer@gmail.com', 'hashedpass123'),
    ('MythicRunner', 'mythic.runner@yahoo.com', 'securepass456'),
    ('LegendaryTank', 'legendary.tank@hotmail.com', 'tankpass789'),
    ('HealerPro', 'healer.pro@gmail.com', 'healpass321'),
    ('DPSMaster', 'dps.master@outlook.com', 'dpspass654');

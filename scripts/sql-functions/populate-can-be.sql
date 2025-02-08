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
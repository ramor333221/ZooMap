-- Reset the identity sequences so new inserts via Hibernate pick up correct IDs
ALTER TABLE destination ALTER COLUMN id RESTART WITH 11;
ALTER TABLE routes ALTER COLUMN id RESTART WITH 10;

-- ============================================================================
-- 0. CLEANUP EXISTING DATA
-- ============================================================================
DELETE FROM route_body_points;
DELETE FROM routes;
DELETE FROM destination;

-- ============================================================================
-- 1. INSERT 10 DESTINATIONS
-- ============================================================================
INSERT INTO destination (id, name, pic_url, description, category, x, y) VALUES
                                                                             (1, 'Main Entrance', 'url/entrance.png', 'The main gateway', 5, 50.0, 10.0),
                                                                             (2, 'Ticketing Office', 'url/tickets.png', 'Buy your tickets here', 2, 55.0, 15.0),
                                                                             (3, 'Lion Enclosure', 'url/lions.png', 'Home of the African Lions', 0, 40.0, 30.0),
                                                                             (4, 'Elephant Habitat', 'url/elephants.png', 'The majestic giants', 0, 30.0, 50.0),
                                                                             (5, 'Main Picnic Area', 'url/picnic.png', 'Shaded tables and benches', 1, 60.0, 45.0),
                                                                             (6, 'Central Junction', 'url/split.png', 'A major path intersection', 4, 50.0, 40.0),
                                                                             (7, 'Monkey Island', 'url/monkeys.png', 'Playful primates', 0, 70.0, 60.0),
                                                                             (8, 'Reptile House', 'url/reptiles.png', 'Exotic lizards and snakes', 0, 50.0, 75.0),
                                                                             (9, 'Restrooms & Cafe', 'url/cafe.png', 'Food and refreshments', 2, 65.0, 30.0),
                                                                             (10, 'South Exit', 'url/exit.png', 'Exit to the parking lot', 6, 50.0, 95.0);

-- ============================================================================
-- 2. INSERT 9 ROUTES (The connecting edges)
-- ============================================================================
INSERT INTO routes (id, dist, FROMD, TOD) VALUES
                                              (1, 7.0, 1, 2),
                                              (2, 25.5, 2, 6),
                                              (3, 14.1, 6, 3),
                                              (4, 22.3, 3, 4),
                                              (5, 11.1, 6, 5),
                                              (6, 18.0, 5, 7),
                                              (7, 35.0, 6, 8),
                                              (8, 15.8, 5, 9),
                                              (9, 20.0, 8, 10);

-- ============================================================================
-- 3. INSERT DETAILED PATHWAY COORDINATES (ElementCollection for Route bodyPoints)
-- ============================================================================
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (1, 0, 50.0, 10.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (1, 1, 52.5, 12.5);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (1, 2, 55.0, 15.0);

INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (2, 0, 55.0, 15.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (2, 1, 53.0, 25.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (2, 2, 50.0, 40.0);

INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (3, 0, 50.0, 40.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (3, 1, 45.0, 35.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (3, 2, 40.0, 30.0);

INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (4, 0, 40.0, 30.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (4, 1, 35.0, 40.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (4, 2, 30.0, 50.0);

INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (5, 0, 50.0, 40.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (5, 1, 55.0, 42.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (5, 2, 60.0, 45.0);

INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (6, 0, 60.0, 45.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (6, 1, 65.0, 52.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (6, 2, 70.0, 60.0);

INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (7, 0, 50.0, 40.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (7, 1, 50.0, 55.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (7, 2, 50.0, 75.0);

INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (8, 0, 60.0, 45.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (8, 1, 62.5, 37.5);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (8, 2, 65.0, 30.0);

INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (9, 0, 50.0, 75.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (9, 1, 50.0, 85.0);
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES (9, 2, 50.0, 95.0);

-- ============================================================================
-- 4. SEQUENCE ADJUSTMENT
-- ============================================================================
ALTER TABLE destination ALTER COLUMN id RESTART WITH 11;
ALTER TABLE routes ALTER COLUMN id RESTART WITH 10;
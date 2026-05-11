-- ============================================================================
-- 0. CLEANUP EXISTING DATA
-- ============================================================================
DELETE FROM route_body_points;
DELETE FROM routes;
DELETE FROM destination;

ALTER TABLE destination ALTER COLUMN id RESTART WITH 11;
ALTER TABLE routes ALTER COLUMN id RESTART WITH 10;

-- ============================================================================
-- 1. INSERT 10 DESTINATIONS (Using picUrl and aaa.png)
-- ============================================================================
INSERT INTO destination (id, name, picUrl, description, category, x, y) VALUES
                                                                            (1, 'North Entry', 'aaa.png', 'The primary access point.', 5, 50.0, 10.0),
                                                                            (2, 'Info Station', 'aaa.png', 'Services and tickets.', 2, 55.0, 15.0),
                                                                            (3, 'North Pavilion', 'aaa.png', 'Observation deck.', 0, 40.0, 30.0),
                                                                            (4, 'West Gardens', 'aaa.png', 'Scenic walking paths.', 0, 30.0, 50.0),
                                                                            (5, 'Main Plaza', 'aaa.png', 'Central gathering area.', 1, 60.0, 45.0),
                                                                            (6, 'Central Junction', 'aaa.png', 'Major intersection.', 4, 50.0, 40.0),
                                                                            (7, 'East Wing', 'aaa.png', 'Climate-controlled area.', 0, 70.0, 60.0),
                                                                            (8, 'South Gallery', 'aaa.png', 'Exhibition space.', 0, 50.0, 75.0),
                                                                            (9, 'Cafe Zone', 'aaa.png', 'Dining area.', 2, 65.0, 30.0),
                                                                            (10, 'South Exit', 'aaa.png', 'Secondary exit.', 6, 50.0, 95.0);

-- ============================================================================
-- 2. INSERT 9 ROUTES
-- ============================================================================
INSERT INTO routes (id, dist, FROMD, TOD) VALUES
                                              (1, 7.0, 1, 2), (2, 25.5, 2, 6), (3, 14.1, 6, 3), (4, 22.3, 3, 4),
                                              (5, 11.1, 6, 5), (6, 18.0, 5, 7), (7, 35.0, 6, 8), (8, 15.8, 5, 9), (9, 20.0, 8, 10);

-- ============================================================================
-- 3. INSERT NON-OVERLAPPING CIRCULAR PATHS
-- ============================================================================

-- Route 1: North Entry -> Info (Small outward loop to the right)
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES
                                                                (1, 0, 50.0, 10.0), (1, 1, 60.0, 8.0), (1, 2, 62.0, 18.0), (1, 3, 55.0, 15.0);

-- Route 2: Info -> Junction (Giant sweeping arc to the far East)
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES
                                                                (2, 0, 55.0, 15.0), (2, 1, 85.0, 15.0), (2, 2, 85.0, 45.0), (2, 3, 50.0, 40.0);

-- Route 3: Junction -> North Pavilion (High arc over the top)
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES
                                                                (3, 0, 50.0, 40.0), (3, 1, 55.0, 20.0), (3, 2, 40.0, 20.0), (3, 3, 40.0, 30.0);

-- Route 4: North Pavilion -> West Gardens (Wide bulge to the far West)
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES
                                                                (4, 0, 40.0, 30.0), (4, 1, 10.0, 25.0), (4, 2, 10.0, 55.0), (4, 3, 30.0, 50.0);

-- Route 5: Junction -> Main Plaza (Circular loop swinging North)
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES
                                                                (5, 0, 50.0, 40.0), (5, 1, 50.0, 30.0), (5, 2, 65.0, 30.0), (5, 3, 60.0, 45.0);

-- Route 6: Plaza -> East Wing (Deep curve to the outer South-East)
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES
                                                                (6, 0, 60.0, 45.0), (6, 1, 85.0, 50.0), (6, 2, 85.0, 70.0), (6, 3, 70.0, 60.0);

-- Route 7: Junction -> Gallery (Extreme deep Western loop to avoid Junction/Plaza lines)
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES
                                                                (7, 0, 50.0, 40.0), (7, 1, 20.0, 40.0), (7, 2, 20.0, 80.0), (7, 3, 50.0, 75.0);

-- Route 8: Plaza -> Cafe Zone (Compact circle bending inward)
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES
                                                                (8, 0, 60.0, 45.0), (8, 1, 75.0, 55.0), (8, 2, 80.0, 35.0), (8, 3, 65.0, 30.0);

-- Route 9: Gallery -> South Exit (Semi-circle bowing to the East)
INSERT INTO route_body_points (route_id, point_order, x, y) VALUES
                                                                (9, 0, 50.0, 75.0), (9, 1, 65.0, 80.0), (9, 2, 65.0, 95.0), (9, 3, 50.0, 95.0);
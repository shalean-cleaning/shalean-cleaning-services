-- Insert cleaner profiles (for demo purposes - bypassing auth.users constraint)
-- Note: In production, these would be created through Supabase Auth signup

-- First, let's disable foreign key checks temporarily for demo data
SET session_replication_role = replica;

-- Insert cleaner profiles
INSERT INTO profiles (id, email, first_name, last_name, phone, role, created_at, updated_at) VALUES
-- Western Cape cleaners
('cc0e8400-e29b-41d4-a716-446655440001', 'sarah.johnson@shalean.com', 'Sarah', 'Johnson', '+27821234567', 'CLEANER', NOW(), NOW()),
('cc0e8400-e29b-41d4-a716-446655440002', 'michael.brown@shalean.com', 'Michael', 'Brown', '+27821234568', 'CLEANER', NOW(), NOW()),
('cc0e8400-e29b-41d4-a716-446655440003', 'emily.davis@shalean.com', 'Emily', 'Davis', '+27821234569', 'CLEANER', NOW(), NOW()),

-- Gauteng cleaners
('cc0e8400-e29b-41d4-a716-446655440004', 'david.wilson@shalean.com', 'David', 'Wilson', '+27821234570', 'CLEANER', NOW(), NOW()),
('cc0e8400-e29b-41d4-a716-446655440005', 'lisa.anderson@shalean.com', 'Lisa', 'Anderson', '+27821234571', 'CLEANER', NOW(), NOW()),

-- KwaZulu-Natal cleaners
('cc0e8400-e29b-41d4-a716-446655440006', 'james.taylor@shalean.com', 'James', 'Taylor', '+27821234572', 'CLEANER', NOW(), NOW()),
('cc0e8400-e29b-41d4-a716-446655440007', 'maria.garcia@shalean.com', 'Maria', 'Garcia', '+27821234573', 'CLEANER', NOW(), NOW()),

-- Eastern Cape cleaners
('cc0e8400-e29b-41d4-a716-446655440008', 'robert.miller@shalean.com', 'Robert', 'Miller', '+27821234574', 'CLEANER', NOW(), NOW()),
('cc0e8400-e29b-41d4-a716-446655440009', 'jennifer.white@shalean.com', 'Jennifer', 'White', '+27821234575', 'CLEANER', NOW(), NOW()),
('cc0e8400-e29b-41d4-a716-446655440010', 'william.harris@shalean.com', 'William', 'Harris', '+27821234576', 'CLEANER', NOW(), NOW());

-- Insert cleaners with their professional details
INSERT INTO cleaners (id, bio, hourly_rate, rating, total_jobs, is_available, created_at) VALUES
-- Western Cape cleaners
('cc0e8400-e29b-41d4-a716-446655440001', 'Professional cleaner with 5+ years experience. Specializes in deep cleaning and organization. Certified in eco-friendly cleaning methods.', 120.00, 4.8, 156, true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440002', 'Experienced cleaner with attention to detail. Available for both residential and commercial cleaning. Background in hospitality cleaning.', 110.00, 4.6, 89, true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440003', 'Reliable and thorough cleaner with eco-friendly cleaning products. Great with pets and children. Flexible scheduling available.', 125.00, 4.9, 203, true, NOW()),

-- Gauteng cleaners
('cc0e8400-e29b-41d4-a716-446655440004', 'Professional cleaner specializing in post-construction cleanup and deep cleaning services. 8+ years experience in commercial spaces.', 130.00, 4.7, 134, true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440005', 'Experienced cleaner with flexible scheduling. Specializes in move-in/move-out cleaning. Background in property management.', 115.00, 4.5, 78, true, NOW()),

-- KwaZulu-Natal cleaners
('cc0e8400-e29b-41d4-a716-446655440006', 'Professional cleaner with expertise in coastal property maintenance. Specializes in humidity-resistant cleaning methods.', 118.00, 4.6, 92, true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440007', 'Detail-oriented cleaner with 6+ years experience. Specializes in luxury home cleaning and maintenance.', 135.00, 4.8, 167, true, NOW()),

-- Eastern Cape cleaners
('cc0e8400-e29b-41d4-a716-446655440008', 'Professional cleaner with industrial cleaning background. Specializes in large residential properties and commercial spaces.', 128.00, 4.7, 145, true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440009', 'Experienced cleaner with focus on sustainable cleaning practices. Certified in green cleaning methods and eco-friendly products.', 122.00, 4.9, 189, true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440010', 'Reliable cleaner with flexible availability. Specializes in regular maintenance cleaning and emergency cleaning services.', 105.00, 4.4, 67, true, NOW());

-- Insert cleaner availability schedules (Monday to Friday for all cleaners)
INSERT INTO cleaner_availability (cleaner_id, region_id, day_of_week, start_time, end_time, is_active, created_at) VALUES
-- Western Cape cleaners availability
('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 1, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 2, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 3, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 4, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 5, '08:00', '17:00', true, NOW()),

('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 1, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 2, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 3, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 4, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 5, '09:00', '18:00', true, NOW()),

('cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 1, '07:00', '16:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 2, '07:00', '16:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 3, '07:00', '16:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 4, '07:00', '16:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 5, '07:00', '16:00', true, NOW()),

-- Gauteng cleaners availability
('cc0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 1, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 2, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 3, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 4, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 5, '08:00', '17:00', true, NOW()),

('cc0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 1, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 2, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 3, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 4, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 5, '09:00', '18:00', true, NOW()),

-- KwaZulu-Natal cleaners availability
('cc0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 1, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 2, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 3, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 4, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 5, '08:00', '17:00', true, NOW()),

('cc0e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 1, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 2, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 3, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 4, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 5, '09:00', '18:00', true, NOW()),

-- Eastern Cape cleaners availability
('cc0e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 1, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 2, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 3, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 4, '08:00', '17:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 5, '08:00', '17:00', true, NOW()),

('cc0e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', 1, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', 2, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', 3, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', 4, '09:00', '18:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', 5, '09:00', '18:00', true, NOW()),

('cc0e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 1, '07:00', '16:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 2, '07:00', '16:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 3, '07:00', '16:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 4, '07:00', '16:00', true, NOW()),
('cc0e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 5, '07:00', '16:00', true, NOW());

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Seed data for Shalean booking system

-- Insert regions
INSERT INTO regions (id, name, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Lagos Mainland', true),
('550e8400-e29b-41d4-a716-446655440002', 'Lagos Island', true),
('550e8400-e29b-41d4-a716-446655440003', 'Abuja', true),
('550e8400-e29b-41d4-a716-446655440004', 'Port Harcourt', true);

-- Insert suburbs
INSERT INTO suburbs (id, name, region_id, is_active) VALUES
-- Lagos Mainland suburbs
('660e8400-e29b-41d4-a716-446655440001', 'Ikeja', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440002', 'Surulere', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440003', 'Yaba', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440004', 'Mushin', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440005', 'Ojodu', '550e8400-e29b-41d4-a716-446655440001', true),

-- Lagos Island suburbs
('660e8400-e29b-41d4-a716-446655440006', 'Victoria Island', '550e8400-e29b-41d4-a716-446655440002', true),
('660e8400-e29b-41d4-a716-446655440007', 'Ikoyi', '550e8400-e29b-41d4-a716-446655440002', true),
('660e8400-e29b-41d4-a716-446655440008', 'Lekki', '550e8400-e29b-41d4-a716-446655440002', true),
('660e8400-e29b-41d4-a716-446655440009', 'Banana Island', '550e8400-e29b-41d4-a716-446655440002', true),

-- Abuja suburbs
('660e8400-e29b-41d4-a716-446655440010', 'Asokoro', '550e8400-e29b-41d4-a716-446655440003', true),
('660e8400-e29b-41d4-a716-446655440011', 'Maitama', '550e8400-e29b-41d4-a716-446655440003', true),
('660e8400-e29b-41d4-a716-446655440012', 'Wuse 2', '550e8400-e29b-41d4-a716-446655440003', true),
('660e8400-e29b-41d4-a716-446655440013', 'Garki', '550e8400-e29b-41d4-a716-446655440003', true),

-- Port Harcourt suburbs
('660e8400-e29b-41d4-a716-446655440014', 'GRA Phase 1', '550e8400-e29b-41d4-a716-446655440004', true),
('660e8400-e29b-41d4-a716-446655440015', 'GRA Phase 2', '550e8400-e29b-41d4-a716-446655440004', true),
('660e8400-e29b-41d4-a716-446655440016', 'Old GRA', '550e8400-e29b-41d4-a716-446655440004', true);

-- Insert service categories
INSERT INTO service_categories (id, name, description) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'House Cleaning', 'Complete house cleaning services'),
('770e8400-e29b-41d4-a716-446655440002', 'Office Cleaning', 'Professional office cleaning services'),
('770e8400-e29b-41d4-a716-446655440003', 'Deep Cleaning', 'Intensive deep cleaning services'),
('770e8400-e29b-41d4-a716-446655440004', 'Post-Construction', 'Cleaning after construction or renovation');

-- Insert services
INSERT INTO services (id, name, description, base_price, per_bedroom_price, per_bathroom_price, duration_minutes, category_id, is_active) VALUES
-- House Cleaning Services
('880e8400-e29b-41d4-a716-446655440001', 'Standard House Cleaning', 'Regular house cleaning including living areas, bedrooms, and bathrooms', 15000.00, 2000.00, 3000.00, 120, '770e8400-e29b-41d4-a716-446655440001', true),
('880e8400-e29b-41d4-a716-446655440002', 'Premium House Cleaning', 'Comprehensive house cleaning with attention to detail', 25000.00, 3000.00, 4000.00, 180, '770e8400-e29b-41d4-a716-446655440001', true),

-- Office Cleaning Services
('880e8400-e29b-41d4-a716-446655440003', 'Office Cleaning', 'Professional office cleaning including desks, floors, and common areas', 20000.00, NULL, NULL, 90, '770e8400-e29b-41d4-a716-446655440002', true),
('880e8400-e29b-41d4-a716-446655440004', 'Commercial Cleaning', 'Large commercial space cleaning', 35000.00, NULL, NULL, 240, '770e8400-e29b-41d4-a716-446655440002', true),

-- Deep Cleaning Services
('880e8400-e29b-41d4-a716-446655440005', 'Deep House Cleaning', 'Intensive cleaning including inside appliances, cabinets, and detailed scrubbing', 40000.00, 5000.00, 6000.00, 300, '770e8400-e29b-41d4-a716-446655440003', true),
('880e8400-e29b-41d4-a716-446655440006', 'Move-in/Move-out Cleaning', 'Complete cleaning for moving in or out of property', 35000.00, 4000.00, 5000.00, 240, '770e8400-e29b-41d4-a716-446655440003', true),

-- Post-Construction Services
('880e8400-e29b-41d4-a716-446655440007', 'Post-Construction Cleaning', 'Specialized cleaning after construction or renovation work', 50000.00, 6000.00, 8000.00, 360, '770e8400-e29b-41d4-a716-446655440004', true);

-- Insert service extras
INSERT INTO service_extras (id, name, description, price, is_active) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Window Cleaning', 'Interior and exterior window cleaning', 5000.00, true),
('990e8400-e29b-41d4-a716-446655440002', 'Appliance Cleaning', 'Deep cleaning of kitchen appliances (oven, refrigerator, etc.)', 8000.00, true),
('990e8400-e29b-41d4-a716-446655440003', 'Carpet Cleaning', 'Professional carpet and rug cleaning', 12000.00, true),
('990e8400-e29b-41d4-a716-446655440004', 'Balcony Cleaning', 'Cleaning and organizing balcony/outdoor spaces', 3000.00, true),
('990e8400-e29b-41d4-a716-446655440005', 'Laundry Service', 'Washing, drying, and folding clothes', 15000.00, true),
('990e8400-e29b-41d4-a716-446655440006', 'Ironing Service', 'Professional ironing of clothes', 8000.00, true),
('990e8400-e29b-41d4-a716-446655440007', 'Pet Hair Removal', 'Specialized cleaning for pet hair and dander', 6000.00, true),
('990e8400-e29b-41d4-a716-446655440008', 'Garage Cleaning', 'Cleaning and organizing garage space', 10000.00, true),
('990e8400-e29b-41d4-a716-446655440009', 'Garden Maintenance', 'Basic garden cleaning and maintenance', 15000.00, true),
('990e8400-e29b-41d4-a716-446655440010', 'Eco-Friendly Products', 'Use of environmentally friendly cleaning products', 2000.00, true);

-- Note: Profiles and cleaners would normally be created through Supabase Auth signup
-- For demonstration purposes, we'll skip inserting profiles and cleaners
-- as they require corresponding auth.users records

-- Note: Cleaner availability, bookings, payments, and notifications
-- would normally be created through the application after users sign up
-- For demonstration purposes, we'll skip these inserts as they require
-- corresponding profile records

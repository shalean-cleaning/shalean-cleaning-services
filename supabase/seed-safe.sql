-- Safe seed data for Shalean booking system - South Africa
-- This script uses INSERT ... ON CONFLICT to handle existing data

-- Insert regions (South African provinces) - skip if exists
INSERT INTO regions (id, name, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Western Cape', true),
('550e8400-e29b-41d4-a716-446655440002', 'Gauteng', true),
('550e8400-e29b-41d4-a716-446655440003', 'KwaZulu-Natal', true),
('550e8400-e29b-41d4-a716-446655440004', 'Eastern Cape', true)
ON CONFLICT (id) DO NOTHING;

-- Insert suburbs (South African cities and areas) - skip if exists
INSERT INTO suburbs (id, name, region_id, is_active) VALUES
-- Western Cape suburbs
('660e8400-e29b-41d4-a716-446655440001', 'Cape Town CBD', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440002', 'Sea Point', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440003', 'Green Point', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440004', 'Camps Bay', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440005', 'Claremont', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440006', 'Rondebosch', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440007', 'Newlands', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440008', 'Constantia', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440009', 'Hout Bay', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440010', 'Stellenbosch', '550e8400-e29b-41d4-a716-446655440001', true),

-- Gauteng suburbs
('660e8400-e29b-41d4-a716-446655440011', 'Sandton', '550e8400-e29b-41d4-a716-446655440002', true),
('660e8400-e29b-41d4-a716-446655440012', 'Rosebank', '550e8400-e29b-41d4-a716-446655440002', true),
('660e8400-e29b-41d4-a716-446655440013', 'Melville', '550e8400-e29b-41d4-a716-446655440002', true),
('660e8400-e29b-41d4-a716-446655440014', 'Pretoria CBD', '550e8400-e29b-41d4-a716-446655440002', true),

-- KwaZulu-Natal suburbs
('660e8400-e29b-41d4-a716-446655440015', 'Durban CBD', '550e8400-e29b-41d4-a716-446655440003', true),
('660e8400-e29b-41d4-a716-446655440016', 'Umhlanga', '550e8400-e29b-41d4-a716-446655440003', true),
('660e8400-e29b-41d4-a716-446655440017', 'Pietermaritzburg', '550e8400-e29b-41d4-a716-446655440003', true),

-- Eastern Cape suburbs
('660e8400-e29b-41d4-a716-446655440018', 'Port Elizabeth', '550e8400-e29b-41d4-a716-446655440004', true),
('660e8400-e29b-41d4-a716-446655440019', 'East London', '550e8400-e29b-41d4-a716-446655440004', true)
ON CONFLICT (id) DO NOTHING;

-- Insert service categories - skip if exists
INSERT INTO service_categories (id, name, description) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'House Cleaning', 'Complete house cleaning services'),
('770e8400-e29b-41d4-a716-446655440002', 'Office Cleaning', 'Professional office cleaning services'),
('770e8400-e29b-41d4-a716-446655440003', 'Deep Cleaning', 'Intensive deep cleaning services'),
('770e8400-e29b-41d4-a716-446655440004', 'Post-Construction', 'Cleaning after construction or renovation')
ON CONFLICT (id) DO NOTHING;

-- Insert services (South African Rand pricing) - skip if exists
INSERT INTO services (id, name, description, base_price, per_bedroom_price, per_bathroom_price, duration_minutes, category_id, is_active) VALUES
-- House Cleaning Services
('880e8400-e29b-41d4-a716-446655440001', 'Standard House Cleaning', 'Regular house cleaning including living areas, bedrooms, and bathrooms', 450.00, 60.00, 90.00, 120, '770e8400-e29b-41d4-a716-446655440001', true),
('880e8400-e29b-41d4-a716-446655440002', 'Premium House Cleaning', 'Comprehensive house cleaning with attention to detail', 750.00, 90.00, 120.00, 180, '770e8400-e29b-41d4-a716-446655440001', true),

-- Office Cleaning Services
('880e8400-e29b-41d4-a716-446655440003', 'Office Cleaning', 'Professional office cleaning including desks, floors, and common areas', 600.00, NULL, NULL, 90, '770e8400-e29b-41d4-a716-446655440002', true),
('880e8400-e29b-41d4-a716-446655440004', 'Commercial Cleaning', 'Large commercial space cleaning', 1050.00, NULL, NULL, 240, '770e8400-e29b-41d4-a716-446655440002', true),

-- Deep Cleaning Services
('880e8400-e29b-41d4-a716-446655440005', 'Deep House Cleaning', 'Intensive cleaning including inside appliances, cabinets, and detailed scrubbing', 1200.00, 150.00, 180.00, 300, '770e8400-e29b-41d4-a716-446655440003', true),
('880e8400-e29b-41d4-a716-446655440006', 'Move-in/Move-out Cleaning', 'Complete cleaning for moving in or out of property', 1050.00, 120.00, 150.00, 240, '770e8400-e29b-41d4-a716-446655440003', true),

-- Post-Construction Services
('880e8400-e29b-41d4-a716-446655440007', 'Post-Construction Cleaning', 'Specialized cleaning after construction or renovation work', 1500.00, 180.00, 240.00, 360, '770e8400-e29b-41d4-a716-446655440004', true)
ON CONFLICT (id) DO NOTHING;

-- Insert service extras (South African Rand pricing) - skip if exists
INSERT INTO service_extras (id, name, description, price, is_active) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Window Cleaning', 'Interior and exterior window cleaning', 150.00, true),
('990e8400-e29b-41d4-a716-446655440002', 'Appliance Cleaning', 'Deep cleaning of kitchen appliances (oven, refrigerator, etc.)', 240.00, true),
('990e8400-e29b-41d4-a716-446655440003', 'Carpet Cleaning', 'Professional carpet and rug cleaning', 360.00, true),
('990e8400-e29b-41d4-a716-446655440004', 'Balcony Cleaning', 'Cleaning and organizing balcony/outdoor spaces', 90.00, true),
('990e8400-e29b-41d4-a716-446655440005', 'Laundry Service', 'Washing, drying, and folding clothes', 450.00, true),
('990e8400-e29b-41d4-a716-446655440006', 'Ironing Service', 'Professional ironing of clothes', 240.00, true),
('990e8400-e29b-41d4-a716-446655440007', 'Pet Hair Removal', 'Specialized cleaning for pet hair and dander', 180.00, true),
('990e8400-e29b-41d4-a716-446655440008', 'Garage Cleaning', 'Cleaning and organizing garage space', 300.00, true),
('990e8400-e29b-41d4-a716-446655440009', 'Garden Maintenance', 'Basic garden cleaning and maintenance', 450.00, true),
('990e8400-e29b-41d4-a716-446655440010', 'Eco-Friendly Products', 'Use of environmentally friendly cleaning products', 60.00, true)
ON CONFLICT (id) DO NOTHING;

-- Note: Profiles and cleaners will be created through the application when users sign up
-- This seed file only contains the basic data needed for the application to function

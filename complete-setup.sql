
-- ============================================
-- SHALEAN BOOKING SYSTEM - COMPLETE SETUP
-- ============================================
-- Execute this script in your Supabase Dashboard SQL Editor
-- URL: https://supabase.com/dashboard/project/ytitquypkuboktpypjwa/sql

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'CLEANER', 'ADMIN');
CREATE TYPE booking_status AS ENUM ('DRAFT', 'READY_FOR_PAYMENT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role user_role DEFAULT 'CUSTOMER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create regions table
CREATE TABLE regions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create suburbs table
CREATE TABLE suburbs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_categories table
CREATE TABLE service_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create services table
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    per_bedroom_price DECIMAL(10,2),
    per_bathroom_price DECIMAL(10,2),
    duration_minutes INTEGER DEFAULT 60,
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_extras table
CREATE TABLE service_extras (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cleaners table
CREATE TABLE cleaners (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    bio TEXT,
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    rating DECIMAL(3,2),
    total_jobs INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cleaner_availability table
CREATE TABLE cleaner_availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cleaner_id UUID REFERENCES cleaners(id) ON DELETE CASCADE,
    region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    cleaner_id UUID REFERENCES cleaners(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    suburb_id UUID REFERENCES suburbs(id) ON DELETE SET NULL,
    address TEXT NOT NULL,
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    special_instructions TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    extras_price DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    status booking_status DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create booking_items table
CREATE TABLE booking_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    service_extra_id UUID REFERENCES service_extras(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    paystack_reference TEXT,
    paystack_transaction_id TEXT,
    status payment_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM profiles 
        WHERE id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_regions_active ON regions(is_active);
CREATE INDEX idx_suburbs_region ON suburbs(region_id);
CREATE INDEX idx_suburbs_active ON suburbs(is_active);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_service_extras_active ON service_extras(is_active);
CREATE INDEX idx_cleaners_available ON cleaners(is_available);
CREATE INDEX idx_cleaner_availability_cleaner ON cleaner_availability(cleaner_id);
CREATE INDEX idx_cleaner_availability_day ON cleaner_availability(day_of_week);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_cleaner ON bookings(cleaner_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_booking_items_booking ON booking_items(booking_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suburbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaners ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaner_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Public data policies (regions, suburbs, services, etc.)
CREATE POLICY "Anyone can view active regions" ON regions FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active suburbs" ON suburbs FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view service categories" ON service_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active service extras" ON service_extras FOR SELECT USING (is_active = true);

-- Cleaners: Public can view available cleaners
CREATE POLICY "Anyone can view available cleaners" ON cleaners FOR SELECT USING (is_available = true);
CREATE POLICY "Cleaners can update own profile" ON cleaners FOR UPDATE USING (auth.uid() = id);

-- Cleaner availability: Public can view active availability
CREATE POLICY "Anyone can view active cleaner availability" ON cleaner_availability FOR SELECT USING (is_active = true);

-- Bookings: Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = cleaner_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = cleaner_id);

-- Booking items: Users can view items for their bookings
CREATE POLICY "Users can view booking items for own bookings" ON booking_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = booking_items.booking_id 
        AND (bookings.customer_id = auth.uid() OR bookings.cleaner_id = auth.uid())
    )
);
CREATE POLICY "Users can create booking items for own bookings" ON booking_items FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = booking_items.booking_id 
        AND bookings.customer_id = auth.uid()
    )
);

-- Payments: Users can view payments for their bookings
CREATE POLICY "Users can view payments for own bookings" ON payments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = payments.booking_id 
        AND (bookings.customer_id = auth.uid() OR bookings.cleaner_id = auth.uid())
    )
);
CREATE POLICY "Users can create payments for own bookings" ON payments FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = payments.booking_id 
        AND bookings.customer_id = auth.uid()
    )
);

-- Notifications: Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);


-- ============================================
-- SEED DATA
-- ============================================

-- Seed data for Shalean booking system - South Africa

-- Insert regions (South African provinces)
INSERT INTO regions (id, name, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Western Cape', true),
('550e8400-e29b-41d4-a716-446655440002', 'Gauteng', true),
('550e8400-e29b-41d4-a716-446655440003', 'KwaZulu-Natal', true),
('550e8400-e29b-41d4-a716-446655440004', 'Eastern Cape', true);

-- Insert suburbs (South African cities and areas)
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
('660e8400-e29b-41d4-a716-446655440019', 'East London', '550e8400-e29b-41d4-a716-446655440004', true);

-- Insert service categories
INSERT INTO service_categories (id, name, description) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'House Cleaning', 'Complete house cleaning services'),
('770e8400-e29b-41d4-a716-446655440002', 'Office Cleaning', 'Professional office cleaning services'),
('770e8400-e29b-41d4-a716-446655440003', 'Deep Cleaning', 'Intensive deep cleaning services'),
('770e8400-e29b-41d4-a716-446655440004', 'Post-Construction', 'Cleaning after construction or renovation');

-- Insert services (South African Rand pricing)
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
('880e8400-e29b-41d4-a716-446655440007', 'Post-Construction Cleaning', 'Specialized cleaning after construction or renovation work', 1500.00, 180.00, 240.00, 360, '770e8400-e29b-41d4-a716-446655440004', true);

-- Insert service extras (South African Rand pricing)
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
('990e8400-e29b-41d4-a716-446655440010', 'Eco-Friendly Products', 'Use of environmentally friendly cleaning products', 60.00, true);

-- Insert cleaner profiles (for demo purposes)
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


-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created successfully
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'regions', 'suburbs', 'services', 'service_extras', 'cleaners', 'bookings');

-- Check if data was inserted
SELECT 'regions' as table_name, COUNT(*) as count FROM regions
UNION ALL
SELECT 'suburbs', COUNT(*) FROM suburbs
UNION ALL
SELECT 'service_categories', COUNT(*) FROM service_categories
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'service_extras', COUNT(*) FROM service_extras
UNION ALL
SELECT 'cleaners', COUNT(*) FROM cleaners;

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

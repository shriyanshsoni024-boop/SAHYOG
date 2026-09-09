-- ==============================================================================
-- SAHYOG Database Migration: 001 - Initial Core Schema
-- Database: PostgreSQL (Supabase)
-- Version: 1.0.0
-- ==============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enumerated Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'worker', 'admin', 'cooperative');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'REQUESTED',
        'MATCHED',
        'ACCEPTED',
        'ON_THE_WAY',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM (
        'PENDING',
        'UNDER_REVIEW',
        'VERIFIED',
        'REJECTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE worker_availability AS ENUM (
        'AVAILABLE',
        'BUSY',
        'NOT_AVAILABLE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_tier AS ENUM ('SMALL', 'MEDIUM', 'LARGE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE urgency_level AS ENUM ('NORMAL', 'EMERGENCY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Utility Trigger: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. TABLE: profiles
-- Extends Supabase auth.users with SAHYOG identity, roles, and address
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'customer',
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    address TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT 'Noida',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 5. TABLE: workers
-- Cooperative verified artisans & tradespeople profiles
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    name_hi TEXT,
    phone TEXT NOT NULL,
    avatar TEXT,
    trade TEXT NOT NULL,
    professions TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    experience_years INT NOT NULL DEFAULT 1,
    experience_level TEXT NOT NULL DEFAULT 'Intermediate' CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced')),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
    review_count INT NOT NULL DEFAULT 0,
    completed_jobs INT NOT NULL DEFAULT 0,
    distance_km NUMERIC(4, 1) NOT NULL DEFAULT 1.0,
    availability worker_availability NOT NULL DEFAULT 'AVAILABLE',
    emergency_ready BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status verification_status NOT NULL DEFAULT 'PENDING',
    cooperative_branch TEXT NOT NULL DEFAULT 'SAHYOG Central Federation',
    zone TEXT NOT NULL DEFAULT 'Zone 1 - Central',
    aadhaar_masked TEXT,
    pan_masked TEXT,
    certificates_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    training_completed TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_workers_updated_at
    BEFORE UPDATE ON public.workers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_workers_availability ON public.workers(availability);
CREATE INDEX IF NOT EXISTS idx_workers_verification ON public.workers(verification_status);
CREATE INDEX IF NOT EXISTS idx_workers_emergency ON public.workers(emergency_ready);
CREATE INDEX IF NOT EXISTS idx_workers_zone ON public.workers(zone);

-- ==============================================================================
-- 6. TABLE: services
-- Standardized cooperative rate cards & service categories
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    category TEXT NOT NULL,
    category_id TEXT NOT NULL,
    base_price INT NOT NULL CHECK (base_price >= 0),
    original_price INT NOT NULL DEFAULT 0,
    emergency_available BOOLEAN NOT NULL DEFAULT FALSE,
    duration TEXT NOT NULL DEFAULT '45-60 mins',
    duration_hi TEXT NOT NULL DEFAULT '45-60 मिनट',
    description TEXT NOT NULL DEFAULT '',
    description_hi TEXT NOT NULL DEFAULT '',
    icon TEXT NOT NULL DEFAULT 'Wrench',
    image_url TEXT,
    skills TEXT[] NOT NULL DEFAULT '{}',
    popular BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_emergency ON public.services(emergency_available);

-- ==============================================================================
-- 7. TABLE: bookings
-- Central marketplace service dispatches & lifecycle tracking
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    worker_id UUID REFERENCES public.workers(id) ON DELETE SET NULL,
    service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    service_category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    lat NUMERIC(9, 6),
    lng NUMERIC(9, 6),
    scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    scheduled_time TEXT NOT NULL DEFAULT 'Immediate Dispatch',
    urgency urgency_level NOT NULL DEFAULT 'NORMAL',
    tier service_tier NOT NULL DEFAULT 'MEDIUM',
    estimated_price INT NOT NULL CHECK (estimated_price >= 0),
    connection_fee INT NOT NULL DEFAULT 25 CHECK (connection_fee >= 0),
    total_price INT NOT NULL CHECK (total_price >= 0),
    worker_payout INT NOT NULL CHECK (worker_payout >= 0),
    status booking_status NOT NULL DEFAULT 'REQUESTED',
    otp TEXT NOT NULL DEFAULT '4829',
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID')),
    customer_rating NUMERIC(2, 1) CHECK (customer_rating >= 1 AND customer_rating <= 5),
    customer_review TEXT,
    worker_rating NUMERIC(2, 1) CHECK (worker_rating >= 1 AND worker_rating <= 5),
    worker_review TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_bookings_token ON public.bookings(token);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker ON public.bookings(worker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_urgency ON public.bookings(urgency);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- ==============================================================================
-- 8. TABLE: booking_status_history
-- Immutable audit log of every booking state transition
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    status booking_status NOT NULL,
    note TEXT,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_booking ON public.booking_status_history(booking_id);

-- Automatic status history trigger on booking insertion/update
CREATE OR REPLACE FUNCTION log_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.booking_status_history (booking_id, status, note, timestamp)
        VALUES (
            NEW.id,
            NEW.status,
            CASE
                WHEN NEW.status = 'REQUESTED' THEN 'Booking requested by customer'
                WHEN NEW.status = 'MATCHED' THEN 'Artisan matched via cooperative dispatch'
                WHEN NEW.status = 'ACCEPTED' THEN 'Artisan accepted the job request'
                WHEN NEW.status = 'ON_THE_WAY' THEN 'Artisan is en route to customer location'
                WHEN NEW.status = 'IN_PROGRESS' THEN 'Customer 4-digit OTP verified. Work started.'
                WHEN NEW.status = 'COMPLETED' THEN 'Work finished & verified. 30-day warranty activated.'
                WHEN NEW.status = 'CANCELLED' THEN 'Booking was cancelled.'
                ELSE 'Status updated to ' || NEW.status
            END,
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_booking_status
    AFTER INSERT OR UPDATE OF status ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION log_booking_status_change();

-- ==============================================================================
-- 9. TABLE: worker_earnings
-- 0% Commission direct artisan payouts & ledger
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.worker_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    booking_token TEXT NOT NULL,
    service_name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    amount INT NOT NULL CHECK (amount >= 0),
    platform_fee INT NOT NULL DEFAULT 25 CHECK (platform_fee >= 0),
    net_payout INT NOT NULL CHECK (net_payout >= 0),
    status TEXT NOT NULL DEFAULT 'PAID' CHECK (status IN ('PAID', 'PENDING')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_worker_earnings_worker ON public.worker_earnings(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_earnings_booking ON public.worker_earnings(booking_id);

-- ==============================================================================
-- 10. TABLE: reviews
-- Customer feedback, star ratings & tags
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL DEFAULT '',
    service_name TEXT NOT NULL,
    chips TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_worker ON public.reviews(worker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON public.reviews(booking_id);

-- ==============================================================================
-- 11. TABLE: kyc_records
-- Artisan credential inspection, verification & compliance audit
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.kyc_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
    worker_name TEXT NOT NULL,
    profession TEXT NOT NULL,
    cooperative TEXT NOT NULL,
    documents TEXT NOT NULL,
    status verification_status NOT NULL DEFAULT 'PENDING',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kyc_status ON public.kyc_records(status);
CREATE INDEX IF NOT EXISTS idx_kyc_worker ON public.kyc_records(worker_id);

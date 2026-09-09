-- ==============================================================================
-- SAHYOG Database Migration: 003 - Realtime Publications
-- Database: PostgreSQL (Supabase)
-- Version: 1.0.0
-- ==============================================================================

-- 1. Enable Full Replica Identity so that updates broadcast the complete row state
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.booking_status_history REPLICA IDENTITY FULL;
ALTER TABLE public.workers REPLICA IDENTITY FULL;
ALTER TABLE public.kyc_records REPLICA IDENTITY FULL;

-- 2. Add tables to supabase_realtime publication
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_status_history;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.workers;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.kyc_records;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

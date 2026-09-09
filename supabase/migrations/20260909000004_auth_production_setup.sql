-- ==============================================================================
-- SAHYOG Database Migration: 004 - Production Authentication & Profile RLS Setup
-- Database: PostgreSQL (Supabase)
-- Version: 1.0.0
-- ==============================================================================

-- 1. Profiles Table: Add RLS INSERT policy for newly authenticated users
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Users can insert own profile'
    ) THEN
        CREATE POLICY "Users can insert own profile"
            ON public.profiles FOR INSERT
            WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- 2. Workers Table: Add RLS INSERT policy for registered artisans
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'workers' 
        AND policyname = 'Workers can insert own worker record'
    ) THEN
        CREATE POLICY "Workers can insert own worker record"
            ON public.workers FOR INSERT
            WITH CHECK (profile_id = auth.uid());
    END IF;
END $$;

-- 3. Automatic Profile Provisioning Trigger on auth.users insert
-- Extracts metadata provided during OTP / Email signup
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role_val public.user_role;
    raw_role_str TEXT;
BEGIN
    raw_role_str := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'customer'));
    
    IF raw_role_str = 'worker' THEN
        user_role_val := 'worker'::public.user_role;
    ELSIF raw_role_str = 'admin' OR raw_role_str = 'cooperative' THEN
        user_role_val := 'admin'::public.user_role;
    ELSE
        user_role_val := 'customer'::public.user_role;
    END IF;

    INSERT INTO public.profiles (
        id,
        role,
        name,
        phone,
        email,
        avatar_url,
        city,
        address
    ) VALUES (
        NEW.id,
        user_role_val,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'SAHYOG User'),
        COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(NEW.raw_user_meta_data->>'city', 'Noida'),
        COALESCE(NEW.raw_user_meta_data->>'address', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        role = EXCLUDED.role,
        name = CASE WHEN profiles.name = 'SAHYOG User' THEN EXCLUDED.name ELSE profiles.name END,
        phone = CASE WHEN profiles.phone = '' THEN EXCLUDED.phone ELSE profiles.phone END,
        email = COALESCE(EXCLUDED.email, profiles.email),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger on auth.users (if permissions allow)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_auth_user();

-- 4. Unique index on profiles phone where phone is non-empty
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_phone_unique 
    ON public.profiles (phone) 
    WHERE phone IS NOT NULL AND phone <> '';

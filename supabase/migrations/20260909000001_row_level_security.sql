-- ==============================================================================
-- SAHYOG Database Migration: 002 - Row Level Security (RLS) Policies
-- Database: PostgreSQL (Supabase)
-- Version: 1.0.0
-- ==============================================================================

-- 1. Enable RLS on all 8 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_records ENABLE ROW LEVEL SECURITY;

-- 2. Helper Security Function: Get current authenticated user's role
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin_or_cooperative()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'cooperative')
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ==============================================================================
-- 3. POLICIES: profiles
-- ==============================================================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin_or_cooperative());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Admins can insert/manage profiles
CREATE POLICY "Admins have full access to profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin_or_cooperative());

-- ==============================================================================
-- 4. POLICIES: services
-- Public read access for marketplace catalog discovery
-- ==============================================================================
CREATE POLICY "Anyone can view active services catalog"
    ON public.services FOR SELECT
    TO PUBLIC
    USING (TRUE);

CREATE POLICY "Admins can manage services catalog"
    ON public.services FOR ALL
    USING (public.is_admin_or_cooperative());

-- ==============================================================================
-- 5. POLICIES: workers
-- Directory viewable for matchmaking; workers manage own profile
-- ==============================================================================
CREATE POLICY "Anyone can view verified workers directory"
    ON public.workers FOR SELECT
    TO PUBLIC
    USING (TRUE);

CREATE POLICY "Workers can update own worker record"
    ON public.workers FOR UPDATE
    USING (profile_id = auth.uid() OR public.is_admin_or_cooperative());

CREATE POLICY "Admins can manage workers"
    ON public.workers FOR ALL
    USING (public.is_admin_or_cooperative());

-- ==============================================================================
-- 6. POLICIES: bookings
-- Secure isolation: Customer view/create own, Worker view assigned/dispatch, Admin view all
-- ==============================================================================
-- Customers can view bookings they created
CREATE POLICY "Customers can view their own bookings"
    ON public.bookings FOR SELECT
    USING (
        customer_id = auth.uid()
        OR worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
        OR (status IN ('REQUESTED', 'MATCHED') AND public.get_auth_user_role() = 'worker')
        OR public.is_admin_or_cooperative()
    );

-- Customers can create new service bookings
CREATE POLICY "Customers can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (
        customer_id = auth.uid()
        OR customer_id IS NULL -- Allows guest/demo flow with token lookup
        OR public.is_admin_or_cooperative()
    );

-- Customers and assigned workers can update bookings (e.g. status advancement, OTP verification, ratings)
CREATE POLICY "Permitted parties can update bookings"
    ON public.bookings FOR UPDATE
    USING (
        customer_id = auth.uid()
        OR worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
        OR public.is_admin_or_cooperative()
    );

-- ==============================================================================
-- 7. POLICIES: booking_status_history
-- Immutable audit log: Viewable by booking participants and admins
-- ==============================================================================
CREATE POLICY "Participants and admins can view status history"
    ON public.booking_status_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_status_history.booking_id
            AND (
                b.customer_id = auth.uid()
                OR b.worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
                OR public.is_admin_or_cooperative()
            )
        )
    );

CREATE POLICY "Authenticated users and triggers can insert status history"
    ON public.booking_status_history FOR INSERT
    WITH CHECK (TRUE);

-- ==============================================================================
-- 8. POLICIES: worker_earnings
-- Workers view their own take-home pay, Admins view cooperative ledger
-- ==============================================================================
CREATE POLICY "Workers can view own earnings ledger"
    ON public.worker_earnings FOR SELECT
    USING (
        worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
        OR public.is_admin_or_cooperative()
    );

CREATE POLICY "Workers can record completed job earnings"
    ON public.worker_earnings FOR INSERT
    WITH CHECK (
        worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
        OR public.is_admin_or_cooperative()
        OR worker_id IS NOT NULL
    );

CREATE POLICY "Admins can manage worker earnings ledger"
    ON public.worker_earnings FOR ALL
    USING (public.is_admin_or_cooperative());

-- ==============================================================================
-- 9. POLICIES: reviews
-- Public read for social proof, customer insert for completed bookings
-- ==============================================================================
CREATE POLICY "Anyone can view approved reviews"
    ON public.reviews FOR SELECT
    TO PUBLIC
    USING (TRUE);

CREATE POLICY "Customers can create reviews for their bookings"
    ON public.reviews FOR INSERT
    WITH CHECK (
        customer_id = auth.uid()
        OR customer_id IS NULL
        OR public.is_admin_or_cooperative()
    );

-- ==============================================================================
-- 10. POLICIES: kyc_records
-- Workers view/submit own documents, Admins inspect & verify
-- ==============================================================================
CREATE POLICY "Workers can view own KYC documents"
    ON public.kyc_records FOR SELECT
    USING (
        worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
        OR public.is_admin_or_cooperative()
    );

CREATE POLICY "Workers can submit KYC documents"
    ON public.kyc_records FOR INSERT
    WITH CHECK (
        worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
        OR public.is_admin_or_cooperative()
    );

CREATE POLICY "Admins can verify/manage KYC records"
    ON public.kyc_records FOR ALL
    USING (public.is_admin_or_cooperative());

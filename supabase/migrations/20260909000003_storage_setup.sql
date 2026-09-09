-- ==============================================================================
-- SAHYOG Database Migration: 004 - Supabase Storage Buckets & Policies
-- Database: PostgreSQL (Supabase)
-- Version: 1.0.0
-- ==============================================================================

-- 1. Create storage buckets for KYC, certificates, and media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('kyc-documents', 'kyc-documents', FALSE, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
    ('worker-certificates', 'worker-certificates', TRUE, 26214400, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
    ('service-images', 'service-images', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage RLS Policies for kyc-documents (Private, Authenticated Worker Upload, Admin Review)
CREATE POLICY "Workers can upload own KYC documents"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'kyc-documents'
        AND (auth.role() = 'authenticated')
    );

CREATE POLICY "Workers can read own KYC documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'kyc-documents'
        AND (
            auth.uid()::text = (storage.foldername(name))[1]
            OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'cooperative'))
        )
    );

CREATE POLICY "Admins have full access to KYC documents"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'kyc-documents'
        AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'cooperative'))
    );

-- 3. Storage RLS Policies for worker-certificates (Public Read, Verified Worker / Admin Upload)
CREATE POLICY "Anyone can view worker trade certificates"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'worker-certificates');

CREATE POLICY "Authenticated workers can upload trade certificates"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'worker-certificates'
        AND (auth.role() = 'authenticated')
    );

-- 4. Storage RLS Policies for service-images (Public Read, Admin Upload)
CREATE POLICY "Anyone can view service images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'service-images');

CREATE POLICY "Admins can upload service imagery"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'service-images'
        AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'cooperative'))
    );

-- ============================================
-- VIVAH - Supabase Setup SQL
-- Run ALL of this in your Supabase SQL Editor
-- Go to: Supabase Dashboard > SQL Editor > New Query
-- Paste everything below and click "Run"
-- ============================================

-- 1. Create the invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  wedding_type TEXT,
  bride_name TEXT,
  bride_nickname TEXT,
  bride_bio TEXT,
  bride_photo_url TEXT,
  groom_name TEXT,
  groom_nickname TEXT,
  groom_bio TEXT,
  groom_photo_url TEXT,
  love_story JSONB,
  family_details JSONB,
  events JSONB,
  design_theme TEXT,
  music_settings JSONB,
  rsvp_settings JSONB,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- 3. Allow users to manage only their own invitations
CREATE POLICY "Users can manage their own invitations"
  ON invitations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Allow anyone to VIEW published invitations (needed for the public /i/:slug page)
CREATE POLICY "Public invitations are readable by anyone"
  ON invitations FOR SELECT
  USING (is_published = true);

-- 5. Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('invitation-photos', 'invitation-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'invitation-photos');

-- 7. Allow public read of photos
CREATE POLICY "Photos are publicly readable"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'invitation-photos');

-- 8. Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'invitation-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- DONE! Your Supabase is now fully configured.
-- ============================================

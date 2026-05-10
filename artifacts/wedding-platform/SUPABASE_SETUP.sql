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

-- 9. Guests / RSVP responses
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  attending BOOLEAN,
  plus_one BOOLEAN DEFAULT false,
  guest_count INTEGER DEFAULT 1,
  meal_preference TEXT,
  dietary_notes TEXT,
  events_attending TEXT[],
  table_number TEXT,
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  qr_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Invitation owners manage guests" ON guests FOR ALL USING (
  EXISTS (SELECT 1 FROM invitations WHERE id = guests.invitation_id AND user_id = auth.uid())
);
CREATE POLICY "Guests can insert themselves" ON guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read guests by invitation" ON guests FOR SELECT USING (true);

-- 10. Wishes / Blessings wall
CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  relation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can add wishes" ON wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Wishes are public" ON wishes FOR SELECT USING (true);

-- 11. Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can attempt quiz" ON quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Quiz attempts are public" ON quiz_attempts FOR SELECT USING (true);

-- 12. Add extra columns to invitations
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS wedding_hashtag TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS guest_greeting TEXT;

-- ============================================
-- DONE! Your Supabase is now fully configured.
-- ============================================

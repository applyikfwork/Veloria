/*
-- Run this in Supabase SQL editor:
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

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own invitations"
  ON invitations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public invitations are readable by anyone"
  ON invitations FOR SELECT
  USING (is_published = true);
*/

import { supabase } from './supabase';

export async function saveInvitation(formData: any, userId: string, customSlug?: string) {
  // Generate default slug if none provided
  let slug = customSlug;
  if (!slug) {
    const brideName = formData.bride?.name || 'priya';
    const groomName = formData.groom?.name || 'arjun';
    slug = `${brideName.toLowerCase()}weds${groomName.toLowerCase()}`;
  }

  // Strip spaces and special chars from slug
  slug = slug.replace(/[^a-z0-9]/gi, '').toLowerCase();

  // Helper to upload base64 to storage
  async function uploadPhoto(base64Data: string, fileName: string) {
    if (!base64Data || !base64Data.startsWith('data:')) return base64Data;

    try {
      const response = await fetch(base64Data);
      const blob = await response.blob();
      const fileExt = blob.type.split('/')[1];
      const filePath = `${userId}/${fileName}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('invitation-photos')
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invitation-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return base64Data;
    }
  }

  // Upload photos if they are base64
  const bridePhotoUrl = await uploadPhoto(formData.bride?.photo, 'bride');
  const groomPhotoUrl = await uploadPhoto(formData.groom?.photo, 'groom');

  const invitationData = {
    user_id: userId,
    slug,
    wedding_type: formData.weddingType,
    bride_name: formData.bride?.name,
    bride_nickname: formData.bride?.nickname,
    bride_bio: formData.bride?.bio,
    bride_photo_url: bridePhotoUrl,
    groom_name: formData.groom?.name,
    groom_nickname: formData.groom?.nickname,
    groom_bio: formData.groom?.bio,
    groom_photo_url: groomPhotoUrl,
    love_story: formData.loveStory,
    family_details: formData.familyDetails,
    events: formData.events,
    design_theme: formData.designTheme,
    music_settings: formData.music,
    rsvp_settings: formData.rsvp,
    is_published: true,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('invitations')
    .upsert(invitationData, { onConflict: 'slug' })
    .select()
    .single();

  if (error) throw error;

  return { id: data.id, slug: data.slug };
}

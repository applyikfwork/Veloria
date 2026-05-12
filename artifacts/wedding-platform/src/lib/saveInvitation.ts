import { supabase } from './supabase';

export async function saveInvitation(formData: any, userId: string, customSlug?: string) {
  let slug = customSlug;
  if (!slug) {
    const brideName = formData.bride?.name || 'priya';
    const groomName = formData.groom?.name || 'arjun';
    slug = `${brideName.toLowerCase()}weds${groomName.toLowerCase()}`;
  }
  slug = slug.replace(/[^a-z0-9]/gi, '').toLowerCase();

  async function uploadPhoto(base64Data: string, fileName: string): Promise<string> {
    if (!base64Data || !base64Data.startsWith('data:')) return base64Data;
    try {
      const response = await fetch(base64Data);
      const blob = await response.blob();
      const fileExt = blob.type.split('/')[1] || 'jpg';
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

  async function uploadPhotoArray(arr: (string | null)[], prefix: string): Promise<string[]> {
    const results = await Promise.all(
      (arr || []).map(async (photo, i) => {
        if (!photo) return '';
        return await uploadPhoto(photo, `${prefix}-${i}`);
      })
    );
    return results.filter(Boolean);
  }

  const bridePhotoUrl = await uploadPhoto(formData.bride?.photo || '', 'bride');
  const groomPhotoUrl = await uploadPhoto(formData.groom?.photo || '', 'groom');

  const couplePhotos = await uploadPhotoArray(formData.photos?.couple || [], 'couple');
  const preWeddingPhotos = await uploadPhotoArray(formData.photos?.preWedding || [], 'pre-wedding');
  const familyPhotos = await uploadPhotoArray(formData.family?.photos || [], 'family');

  const videoUrl = formData.photos?.video
    ? await uploadPhoto(formData.photos.video, 'video')
    : null;

  // Gallery stored inside family_details.gallery — no extra DB column needed
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
    family_details: {
      ...(typeof formData.family === 'object' ? formData.family : {}),
      photos: familyPhotos,
      gallery: {
        couple: couplePhotos,
        preWedding: preWeddingPhotos,
        video: videoUrl,
        captions: formData.photos?.captions || {},
      },
    },
    events: formData.events,
    design_theme: formData.designTheme,
    music_settings: {
      ...(typeof formData.music === 'object' ? formData.music : {}),
    },
    rsvp_settings: {
      ...(typeof formData.rsvp === 'object' ? formData.rsvp : {}),
      giftRegistry: formData.giftRegistry || { enabled: false },
      liveStream: formData.liveStream || { enabled: false },
      templateSettings: {
        colorMood: formData.colorMood,
        filterStyle: formData.filterStyle,
        sparkleIntensity: formData.sparkleIntensity,
      },
    },
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

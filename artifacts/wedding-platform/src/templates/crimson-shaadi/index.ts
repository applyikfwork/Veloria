import CrimsonShaadiInvitation from '@/components/themes/CrimsonShaadi';
import type { TemplateModule } from '../types';

const CrimsonShaadi: TemplateModule = {
  id: 'crimson-shaadi',
  designTheme: 'crimson-shaadi',
  name: 'Crimson Shaadi',
  tagline: 'Classic deep red Bollywood grandeur',
  heroEmoji: '🌹',
  accentColor: '#D4AF37',
  cardGradient: 'from-[#1A0000] via-[#2A0101] to-[#1A0000]',
  swatches: ['#8B0000', '#D4AF37', '#006400', '#2A0101'],
  ceremony: 'wedding',
  style: 'bollywood',
  region: 'north-indian',
  mood: 'festive',
  music: 'bollywood',
  tags: ['Veloria Bollywood Signature', 'Trending', 'Classic Red', 'Cinematic'],
  isPremium: true,
  isNew: true,
  isTrending: true,
  usedByCount: 198,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Star Cast',
      subtitle: 'The lead roles in your Bollywood love story',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Rhea Malhotra', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Photo", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Kabir Sharma', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Photo", column: 'right' },
      ],
    },
    {
      id: 'bollywood-style',
      title: 'Bollywood Style',
      subtitle: 'Choose the cinematic filter that shapes the entire look of your invitation',
      fields: [
        {
          key: 'filterStyle',
          type: 'choice',
          label: 'Cinematic Filter',
          options: ['vintage-cinema', 'modern-vibrant', 'warm-candlelight'],
          hint: 'Applied as a visual overlay throughout the invitation',
        },
      ],
    },
    {
      id: 'events',
      title: 'The Script — Scenes & Events',
      subtitle: 'Each ceremony is a dramatic scene in your wedding story',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 6 },
      ],
    },
    {
      id: 'family',
      title: 'The Supporting Cast',
      subtitle: 'Family names appear in gilded frames on the invitation',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Mr. Anil Malhotra', 'Mrs. Sunita Malhotra'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Mr. Rajan Sharma', 'Mrs. Geeta Sharma'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Family Blessing', placeholder: '"May your love story be the greatest ever told..."', column: 'full' },
      ],
    },
    {
      id: 'photos',
      title: 'The Montage',
      subtitle: 'Your photos play as a cinematic slideshow with Bollywood flair',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6, hint: 'Displayed in the cinematic film-style gallery' },
        { key: 'photos.preWedding', type: 'photo-array', label: 'Pre-Wedding Shoot', maxItems: 4 },
      ],
    },
    {
      id: 'rsvp',
      title: 'The Grand Celebration',
      subtitle: 'Let guests confirm with a confetti-burst RSVP experience',
      fields: [
        { key: 'rsvp.enabled', type: 'toggle', label: 'Enable RSVP', hint: 'Guests tap the celebration button to trigger confetti and confirm attendance' },
      ],
    },
  ],

  defaultFormData: {
    bride: { name: '', photo: null },
    groom: { name: '', photo: null },
    filterStyle: 'vintage-cinema',
    loveStory: { howTheyMet: '', specialMoments: '', proposalStory: '' },
    events: [],
    family: { brideParents: ['', ''], groomParents: ['', ''], blessingQuote: '' },
    photos: { couple: Array(6).fill(null), preWedding: Array(4).fill(null) },
    rsvp: { enabled: true },
    designTheme: 'crimson-shaadi',
  },

  InvitationComponent: CrimsonShaadiInvitation,
};

export default CrimsonShaadi;

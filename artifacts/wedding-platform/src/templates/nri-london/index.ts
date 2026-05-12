import NRILondonInvitation from '@/components/themes/NRILondon';
import type { TemplateModule } from '../types';

const NRILondon: TemplateModule = {
  id: 'nri-london',
  designTheme: 'nri-london',
  name: 'NRI London',
  tagline: 'Contemporary minimal elegance for the global Indian couple',
  heroEmoji: '✨',
  accentColor: '#C9A84C',
  cardGradient: 'from-[#111114] via-[#0A0A0C] to-[#050508]',
  swatches: ['#C9A84C', '#A8A8B3', '#1C1C1E', '#F8F5F0'],
  ceremony: 'wedding',
  style: 'luxury',
  region: 'destination',
  mood: 'modern',
  music: 'ambient',
  tags: ['NRI', 'London', 'Dubai', 'Contemporary', 'Global', 'Minimal'],
  isPremium: true,
  isNew: true,
  isTrending: true,
  usedByCount: 0,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Couple',
      subtitle: 'Names and portraits for your contemporary wedding invitation',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Priya Sharma', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Portrait", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Rohan Mehta', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Portrait", column: 'right' },
      ],
    },
    {
      id: 'events',
      title: 'The Programme',
      subtitle: 'Add your pre-wedding celebrations and main events',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 8 },
      ],
    },
    {
      id: 'family',
      title: 'Family',
      subtitle: 'Your families on the invitation',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Mr. Sunil Sharma', 'Mrs. Anita Sharma'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Mr. Vikram Mehta', 'Mrs. Seema Mehta'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Family Note', placeholder: '"With the blessings of our families, we begin our forever."', column: 'full' },
      ],
    },
    {
      id: 'photos',
      title: 'Gallery',
      subtitle: 'Curated couple photos for your invitation',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6 },
      ],
    },
    {
      id: 'rsvp',
      title: 'RSVP',
      subtitle: 'Enable RSVP with dietary preference tracking',
      fields: [
        { key: 'rsvp.enabled', type: 'toggle', label: 'Enable RSVP' },
      ],
    },
  ],

  defaultFormData: {
    bride: { name: '', photo: null },
    groom: { name: '', photo: null },
    events: [],
    family: { brideParents: ['', ''], groomParents: ['', ''], blessingQuote: '' },
    photos: { couple: Array(6).fill(null) },
    rsvp: { enabled: true },
    designTheme: 'nri-london',
  },

  InvitationComponent: NRILondonInvitation,
};

export default NRILondon;

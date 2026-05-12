import GujaratiGarbaInvitation from '@/components/themes/GujaratiGarba';
import type { TemplateModule } from '../types';

const GujaratiGarba: TemplateModule = {
  id: 'gujarati-garba',
  designTheme: 'gujarati-garba',
  name: 'Gujarati Garba',
  tagline: 'Mirror-work magic, circular garba energy, saffron & joy',
  heroEmoji: '🪩',
  accentColor: '#FF6B35',
  cardGradient: 'from-[#3D1500] via-[#1A0800] to-[#0A0300]',
  swatches: ['#FF6B35', '#FFD700', '#D62598', '#FF9500'],
  ceremony: 'wedding',
  style: 'festive',
  region: 'pan-indian',
  mood: 'festive',
  music: 'folk',
  tags: ['Gujarati', 'Garba', 'Festive', 'Mirror Work', 'Saffron'],
  isPremium: false,
  isNew: true,
  isTrending: true,
  usedByCount: 0,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Couple',
      subtitle: 'Names for your garba celebration invitation',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Dhara Patel', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Portrait", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Viraj Shah', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Portrait", column: 'right' },
      ],
    },
    {
      id: 'events',
      title: 'Garba Celebrations',
      subtitle: 'Add your Garba, Mehndi, Wedding and Reception events',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 6 },
      ],
    },
    {
      id: 'family',
      title: 'Family Blessings',
      subtitle: 'Your families united in celebration',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Mr. Haresh Patel', 'Mrs. Kiran Patel'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Mr. Dinesh Shah', 'Mrs. Priya Shah'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Family Blessing', placeholder: '"May their love dance like the garba — joyful, circular, and eternal."', column: 'full' },
      ],
    },
    {
      id: 'photos',
      title: 'Gallery',
      subtitle: 'Photos for your garba invitation gallery',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6 },
      ],
    },
    {
      id: 'rsvp',
      title: 'Guest RSVP',
      subtitle: 'Let guests confirm their garba attendance',
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
    designTheme: 'gujarati-garba',
  },

  InvitationComponent: GujaratiGarbaInvitation,
};

export default GujaratiGarba;

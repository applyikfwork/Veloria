import MarathiPeshwaInvitation from '@/components/themes/MarathiPeshwa';
import type { TemplateModule } from '../types';

const MarathiPeshwa: TemplateModule = {
  id: 'marathi-peshwa',
  designTheme: 'marathi-peshwa',
  name: 'Marathi Peshwa',
  tagline: 'Paithani silk, deep purple heritage & Pune royalty',
  heroEmoji: '🪷',
  accentColor: '#C9973A',
  cardGradient: 'from-[#2D0F45] via-[#1A0326] to-[#0A0115]',
  swatches: ['#C9973A', '#4A0E6B', '#D4A8FF', '#FAF5EC'],
  ceremony: 'wedding',
  style: 'traditional',
  region: 'pan-indian',
  mood: 'royal',
  music: 'classical',
  tags: ['Marathi', 'Peshwa', 'Paithani', 'Heritage', 'Purple'],
  isPremium: false,
  isNew: true,
  isTrending: false,
  usedByCount: 0,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Couple',
      subtitle: 'Names for your Marathi Peshwa wedding invitation',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Mrunal Desai', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Portrait", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Omkar Joshi', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Portrait", column: 'right' },
      ],
    },
    {
      id: 'events',
      title: 'Vivah Sohala',
      subtitle: 'Add your Haldi, Mehndi, Sakharpuda, Wedding and Reception events',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 6 },
      ],
    },
    {
      id: 'family',
      title: 'Family Ashirwad',
      subtitle: 'Your families united in blessing',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Mr. Ramesh Desai', 'Mrs. Sunanda Desai'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Mr. Shripad Joshi', 'Mrs. Vaishali Joshi'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Family Blessing', placeholder: '"जसा पैठणीचा रंग अखंड, तसं तुमचं प्रेमही अखंड राहो."', column: 'full' },
      ],
    },
    {
      id: 'photos',
      title: 'Gallery',
      subtitle: 'Photos to display in the invitation',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6 },
      ],
    },
    {
      id: 'rsvp',
      title: 'Guest RSVP',
      subtitle: 'Let guests confirm their attendance',
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
    designTheme: 'marathi-peshwa',
  },

  InvitationComponent: MarathiPeshwaInvitation,
};

export default MarathiPeshwa;

import MarigoldRoyaleInvitation from '@/components/themes/MarigoldRoyale';
import type { TemplateModule } from '../types';

const MarigoldRoyale: TemplateModule = {
  id: 'marigold-royale',
  designTheme: 'marigold-royale',
  name: 'Marigold Royale',
  tagline: 'Crimson velvet & Mughal gold — Bollywood royal grandeur',
  heroEmoji: '🌼',
  accentColor: '#C9973A',
  cardGradient: 'from-[#3D0A14] via-[#1C0509] to-[#0A0003]',
  swatches: ['#C9973A', '#3D0A14', '#E8841A', '#FAF5EC'],
  ceremony: 'wedding',
  style: 'bollywood',
  region: 'pan-indian',
  mood: 'royal',
  music: 'bollywood',
  tags: ['Marigold', 'Crimson', 'Mughal', 'Cinematic', 'Royal'],
  isPremium: true,
  isNew: true,
  isTrending: true,
  usedByCount: 312,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Royal Couple',
      subtitle: 'Names and portraits for your Bollywood royal invitation',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Priya Malhotra', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Portrait", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Arjun Kapoor', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Portrait", column: 'right' },
      ],
    },
    {
      id: 'love-story',
      title: 'Your Love Story',
      subtitle: 'The chapters of your love displayed in gold on the invitation',
      fields: [
        { key: 'loveStory.howTheyMet', type: 'textarea', label: 'Chapter I — How did you meet?', placeholder: 'Our eyes first met at...' },
        { key: 'loveStory.specialMoments', type: 'textarea', label: 'Chapter II — Special moments', placeholder: 'A moment we will never forget...' },
        { key: 'loveStory.proposalStory', type: 'textarea', label: 'Chapter III — The proposal', placeholder: 'Surrounded by marigolds, he said...' },
      ],
    },
    {
      id: 'events',
      title: 'The Grand Events',
      subtitle: 'Mehendi, Sangeet, Haldi, Wedding, Reception — each ceremony displayed in gold',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 6 },
      ],
    },
    {
      id: 'family',
      title: 'Family Blessings',
      subtitle: 'Your families united on the formal invitation card',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Mr. Rajesh Malhotra', 'Mrs. Sunita Malhotra'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Mr. Anil Kapoor', 'Mrs. Kavita Kapoor'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Family Blessing', placeholder: '"May their love bloom like marigolds — eternal, golden, and beautiful."', column: 'full' },
      ],
    },
    {
      id: 'photos',
      title: 'The Royal Gallery',
      subtitle: 'Photos displayed in gold-framed masonry gallery',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6, hint: 'Shown in the gold-bordered masonry gallery' },
        { key: 'photos.preWedding', type: 'photo-array', label: 'Pre-Wedding Shoot', maxItems: 4 },
      ],
    },
    {
      id: 'rsvp',
      title: 'Guest RSVP',
      subtitle: 'Elegant RSVP with marigold-gold styling',
      fields: [
        { key: 'rsvp.enabled', type: 'toggle', label: 'Enable RSVP', hint: 'Guests can confirm attendance and leave a message of love' },
      ],
    },
  ],

  defaultFormData: {
    bride: { name: '', photo: null },
    groom: { name: '', photo: null },
    loveStory: { howTheyMet: '', specialMoments: '', proposalStory: '' },
    events: [],
    family: { brideParents: ['', ''], groomParents: ['', ''], blessingQuote: '' },
    photos: { couple: Array(6).fill(null), preWedding: Array(4).fill(null) },
    rsvp: { enabled: true },
    designTheme: 'marigold-royale',
  },

  InvitationComponent: MarigoldRoyaleInvitation,
};

export default MarigoldRoyale;

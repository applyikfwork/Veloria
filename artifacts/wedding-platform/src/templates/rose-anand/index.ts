import RoseAnandInvitation from '@/components/themes/RoseAnand';
import type { TemplateModule } from '../types';

const RoseAnand: TemplateModule = {
  id: 'rose-anand',
  designTheme: 'rose-anand',
  name: 'Rosé Anand',
  tagline: 'Phulkari embroidery & Anand Karaj joy — Punjabi luxury',
  heroEmoji: '🌷',
  accentColor: '#D4A83A',
  cardGradient: 'from-[#1A0A0D] via-[#2A0C14] to-[#1A0A0D]',
  swatches: ['#C87B6A', '#D4A83A', '#E8A0A8', '#5C1020'],
  ceremony: 'anand-karaj',
  style: 'festive',
  region: 'punjabi',
  mood: 'joyful',
  music: 'bhangra',
  tags: ['Punjabi', 'Anand Karaj', 'Phulkari', 'Rose', 'Festive'],
  isPremium: true,
  isNew: true,
  isTrending: true,
  usedByCount: 203,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Blessed Union',
      subtitle: 'Names for your Anand Karaj invitation — Waheguru Ji Ka Khalsa',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Gurpreet Kaur', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Photo", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Harjot Singh', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Photo", column: 'right' },
      ],
    },
    {
      id: 'love-story',
      title: 'Your Love Story',
      subtitle: 'Chapters of your story displayed with phulkari-rose styling',
      fields: [
        { key: 'loveStory.howTheyMet', type: 'textarea', label: 'Chapter I — How did you meet?', placeholder: 'At a family gathering in Punjab, we...' },
        { key: 'loveStory.specialMoments', type: 'textarea', label: 'Chapter II — Special moments', placeholder: 'A road trip to Amritsar where we...' },
        { key: 'loveStory.proposalStory', type: 'textarea', label: 'Chapter III — The proposal', placeholder: 'By the Golden Temple, he asked...' },
      ],
    },
    {
      id: 'events',
      title: 'The Celebrations',
      subtitle: 'Jaggo, Mehendi, Anand Karaj, Reception — each with festive styling',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 6 },
      ],
    },
    {
      id: 'family',
      title: 'The Families',
      subtitle: 'Families displayed with rose-gold borders on the invitation',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['S. Hardeep Singh', 'Smt. Jaswinder Kaur'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['S. Balwinder Singh', 'Smt. Gurjeet Kaur'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Ardas Blessing', placeholder: '"Waheguru Ji Ke Khalsa, Waheguru Ji Ki Fateh — May this union be blessed forever."', column: 'full' },
      ],
    },
    {
      id: 'photos',
      title: 'Gallery',
      subtitle: 'Photos displayed with rose-gold embroidery frames',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6, hint: 'Shown in rose-gold bordered frames' },
        { key: 'photos.preWedding', type: 'photo-array', label: 'Pre-Wedding Shoot', maxItems: 4 },
      ],
    },
    {
      id: 'rsvp',
      title: 'Guest RSVP',
      subtitle: 'Rose-blush RSVP with Punjabi warmth',
      fields: [
        { key: 'rsvp.enabled', type: 'toggle', label: 'Enable RSVP', hint: 'Guests confirm attendance with a joyful rose-styled form' },
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
    designTheme: 'rose-anand',
  },

  InvitationComponent: RoseAnandInvitation,
};

export default RoseAnand;

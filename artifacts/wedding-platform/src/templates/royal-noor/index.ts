import RoyalNoorInvitation from '@/components/themes/RoyalNoor';
import type { TemplateModule } from '../types';

const RoyalNoor: TemplateModule = {
  id: 'royal-noor',
  designTheme: 'royal-noor',
  name: 'The Royal Noor',
  tagline: 'Cinematic palace luxury — Mughal grandeur reimagined',
  heroEmoji: '🏛️',
  accentColor: '#D4AF37',
  cardGradient: 'from-[#0F0F0F] via-[#1C1400] to-[#0F0F0F]',
  swatches: ['#D4AF37', '#5E0B15', '#0F0F0F', '#F5F5F5'],
  ceremony: 'wedding',
  style: 'luxury',
  region: 'pan-indian',
  mood: 'royal',
  music: 'sufi',
  tags: ['Veloria Signature', 'Cinematic', 'Royal', 'Palace'],
  isPremium: false,
  isNew: true,
  isTrending: true,
  usedByCount: 247,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Happy Couple',
      subtitle: 'Names and photos that appear on your cinematic invitation',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Priya Sharma', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Photo", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Arjun Mehta', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Photo", column: 'right' },
      ],
    },
    {
      id: 'love-story',
      title: 'Your Love Story',
      subtitle: 'Chapter-style stories that appear beautifully on the invitation — all optional',
      fields: [
        { key: 'loveStory.howTheyMet', type: 'textarea', label: 'Chapter I — How did you meet?', placeholder: 'We first crossed paths when...' },
        { key: 'loveStory.specialMoments', type: 'textarea', label: 'Chapter II — Special moments together', placeholder: 'One golden evening that changed everything...' },
        { key: 'loveStory.proposalStory', type: 'textarea', label: 'Chapter III — The proposal', placeholder: 'Under a sky full of stars, he said...' },
      ],
    },
    {
      id: 'events',
      title: 'Ceremony & Events',
      subtitle: 'Add each ceremony — Mehndi, Sangeet, Wedding, Reception',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 6 },
      ],
    },
    {
      id: 'family',
      title: 'Family Blessings',
      subtitle: "Your families' names and blessing quote appear on the formal invitation card",
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Mr. Rajesh Sharma', 'Mrs. Sunita Sharma'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Mr. Suresh Mehta', 'Mrs. Kavita Mehta'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Family Blessing Quote', placeholder: '"Two souls, one journey — bound by love and blessed by family."', column: 'full', hint: 'Displayed in italics on the invitation' },
      ],
    },
    {
      id: 'photos',
      title: 'Cinematic Gallery',
      subtitle: 'Your photos appear in the horizontal scroll gallery — upload as many as you like',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6, hint: 'These create the cinematic scrolling gallery on the invitation' },
        { key: 'photos.preWedding', type: 'photo-array', label: 'Pre-Wedding Shoot', maxItems: 4 },
      ],
    },
    {
      id: 'rsvp',
      title: 'Guest RSVP',
      subtitle: 'Let guests confirm attendance directly from the invitation page',
      fields: [
        { key: 'rsvp.enabled', type: 'toggle', label: 'Enable RSVP', hint: 'Guests can confirm attendance, select meal preference, and leave a message' },
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
    designTheme: 'royal-noor',
  },

  InvitationComponent: RoyalNoorInvitation,
};

export default RoyalNoor;

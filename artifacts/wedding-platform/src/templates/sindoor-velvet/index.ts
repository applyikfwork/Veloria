import SindoorVelvetInvitation from '@/components/themes/SindoorVelvet';
import type { TemplateModule } from '../types';

const SindoorVelvet: TemplateModule = {
  id: 'sindoor-velvet',
  designTheme: 'sindoor-velvet',
  name: 'Sindoor Velvet',
  tagline: 'Bengali bridal red & shola art — a Kolkata heritage biye',
  heroEmoji: '🔴',
  accentColor: '#C9973A',
  cardGradient: 'from-[#1A0303] via-[#2A0505] to-[#1A0303]',
  swatches: ['#8B1A1A', '#C9973A', '#FBF8F2', '#1A4A1A'],
  ceremony: 'wedding',
  style: 'heritage',
  region: 'bengali',
  mood: 'literary',
  music: 'rabindra-sangeet',
  tags: ['Bengali', 'Kolkata', 'Biye', 'Sindoor', 'Heritage', 'Alpona'],
  isPremium: true,
  isNew: true,
  isTrending: false,
  usedByCount: 91,

  wizardSteps: [
    {
      id: 'couple',
      title: 'শুভ বিবাহ — The Couple',
      subtitle: 'Names displayed in bold Abril Fatface with Bengali calligraphy above',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Anindita Roy', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Photo", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Debayan Ghosh', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Photo", column: 'right' },
      ],
    },
    {
      id: 'love-story',
      title: 'Your Story',
      subtitle: 'Chapters displayed with shola-white borders on deep red',
      fields: [
        { key: 'loveStory.howTheyMet', type: 'textarea', label: 'Chapter I — How did you meet?', placeholder: 'In the bylanes of Kolkata, we...' },
        { key: 'loveStory.specialMoments', type: 'textarea', label: 'Chapter II — Special moments', placeholder: 'A quiet evening in Rabindra Sarobar...' },
        { key: 'loveStory.proposalStory', type: 'textarea', label: 'Chapter III — The proposal', placeholder: 'With the fragrance of shiuli flowers...' },
      ],
    },
    {
      id: 'events',
      title: 'অনুষ্ঠান — The Ceremonies',
      subtitle: 'Aashirbaad, Gaye Holud, Biye, Bou Bhaat — each in red-gold cards',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 5 },
      ],
    },
    {
      id: 'family',
      title: 'পরিবার — Our Families',
      subtitle: 'Families displayed with alpona borders and shola accents',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Shri Sudipta Roy', 'Shrimati Swapna Roy'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Shri Tapan Ghosh', 'Shrimati Mitali Ghosh'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Ashirvad Blessing', placeholder: '"আশীর্বাদ করি — May you carry each other\'s hearts through every season of life."', column: 'full' },
      ],
    },
    {
      id: 'photos',
      title: 'স্মৃতি — Gallery',
      subtitle: 'Photos in gold-bordered frames with deep red velvet accent',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6, hint: 'Shown in gold-bordered frames on the invitation' },
        { key: 'photos.preWedding', type: 'photo-array', label: 'Pre-Wedding Shoot', maxItems: 4 },
      ],
    },
    {
      id: 'rsvp',
      title: 'Guest RSVP',
      subtitle: 'Bengali-red RSVP with alpona-pattern accents',
      fields: [
        { key: 'rsvp.enabled', type: 'toggle', label: 'Enable RSVP', hint: 'Guests confirm with a heritage-styled form' },
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
    designTheme: 'sindoor-velvet',
  },

  InvitationComponent: SindoorVelvetInvitation,
};

export default SindoorVelvet;

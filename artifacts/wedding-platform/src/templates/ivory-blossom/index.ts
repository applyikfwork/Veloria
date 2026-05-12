import IvoryBlossomInvitation from '@/components/themes/IvoryBlossom';
import type { TemplateModule } from '../types';

const IvoryBlossom: TemplateModule = {
  id: 'ivory-blossom',
  designTheme: 'ivory-blossom',
  name: 'Ivory Blossom',
  tagline: 'Pure South Indian elegance — jasmine, kolam & temple gold',
  heroEmoji: '🌸',
  accentColor: '#BF8C2C',
  cardGradient: 'from-[#FAF6EE] via-[#F5EFE3] to-[#FAF6EE]',
  swatches: ['#BF8C2C', '#2D5016', '#E8C4BE', '#FAF6EE'],
  ceremony: 'wedding',
  style: 'minimal',
  region: 'south-indian',
  mood: 'pure',
  music: 'carnatic',
  tags: ['South Indian', 'Minimal', 'Jasmine', 'Botanical', 'Light'],
  isPremium: false,
  isNew: true,
  isTrending: true,
  usedByCount: 154,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Blessed Couple',
      subtitle: 'Names that appear beneath the jasmine garland arch',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Ananya Krishnan', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Photo", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Karthik Iyer', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Photo", column: 'right' },
      ],
    },
    {
      id: 'love-story',
      title: 'Your Story',
      subtitle: 'Chapters of your love displayed in botanical-bordered cards',
      fields: [
        { key: 'loveStory.howTheyMet', type: 'textarea', label: 'Chapter I — How did you meet?', placeholder: 'Among the temple flowers, we found each other...' },
        { key: 'loveStory.specialMoments', type: 'textarea', label: 'Chapter II — Special moments', placeholder: 'In a quiet garden, we realised...' },
        { key: 'loveStory.proposalStory', type: 'textarea', label: 'Chapter III — The proposal', placeholder: 'With jasmine in the air, he asked...' },
      ],
    },
    {
      id: 'events',
      title: 'The Ceremonies',
      subtitle: 'Muhurtham, Seemantham, Kalyanam — each event in green-bordered cards',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 5 },
      ],
    },
    {
      id: 'family',
      title: 'Family & Blessings',
      subtitle: 'Both families displayed elegantly on the ivory card',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Mr. Suresh Krishnan', 'Mrs. Lalitha Krishnan'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Mr. Venkat Iyer', 'Mrs. Meenakshi Iyer'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Vedic Blessing', placeholder: '"Subhakankshalu — May this union be as pure and fragrant as jasmine."', column: 'full' },
      ],
    },
    {
      id: 'photos',
      title: 'Gallery',
      subtitle: 'Photos in white-bordered frames with temple gold accents',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6, hint: 'Displayed in gold-bordered frames on ivory' },
        { key: 'photos.preWedding', type: 'photo-array', label: 'Pre-Wedding Shoot', maxItems: 4 },
      ],
    },
    {
      id: 'rsvp',
      title: 'Guest RSVP',
      subtitle: 'Clean minimal RSVP on ivory background',
      fields: [
        { key: 'rsvp.enabled', type: 'toggle', label: 'Enable RSVP', hint: 'Guests confirm attendance with a botanical-styled form' },
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
    designTheme: 'ivory-blossom',
  },

  InvitationComponent: IvoryBlossomInvitation,
};

export default IvoryBlossom;

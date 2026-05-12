import MaharajaGoldInvitation from '@/components/themes/MaharajaGold';
import type { TemplateModule } from '../types';

const MaharajaGold: TemplateModule = {
  id: 'maharaja-gold',
  designTheme: 'maharaja-gold',
  name: 'Maharaja Gold',
  tagline: 'Regal grandeur meets timeless tradition',
  heroEmoji: '👑',
  accentColor: '#FFD700',
  cardGradient: 'from-[#120800] via-[#1C1000] to-[#120800]',
  swatches: ['#FFD700', '#9B1B30', '#FDF5E6', '#120800'],
  ceremony: 'wedding',
  style: 'royal',
  region: 'pan-indian',
  mood: 'imperial',
  music: 'classical',
  tags: ['Veloria Ultra-Luxe', 'Heritage', 'Palace', 'Trending'],
  isPremium: true,
  isNew: true,
  isTrending: true,
  usedByCount: 312,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Royal Couple',
      subtitle: 'Names and portraits that grace the imperial invitation',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Ananya Kapoor', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Portrait", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Vikram Singh', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Portrait", column: 'right' },
      ],
    },
    {
      id: 'royal-mood',
      title: 'Royal Color Mood',
      subtitle: 'Choose the palette and visual character of your Maharaja Gold invitation',
      fields: [
        {
          key: 'colorMood',
          type: 'choice',
          label: 'Color Palette',
          options: ['antique-gold-oxblood', 'champagne-gold-emerald', 'rose-gold-navy'],
          hint: 'Each mood transforms the entire visual experience of your invitation',
        },
      ],
    },
    {
      id: 'love-story',
      title: 'The Royal Saga',
      subtitle: 'Your love story rendered as an ancient Shahi scroll on the invitation',
      fields: [
        { key: 'loveStory.howTheyMet', type: 'textarea', label: 'Chapter I — The First Meeting', placeholder: 'It was written in the stars that they would meet...' },
        { key: 'loveStory.specialMoments', type: 'textarea', label: 'Chapter II — The Journey', placeholder: 'Through palace corridors and starlit evenings...' },
        { key: 'loveStory.proposalStory', type: 'textarea', label: 'Chapter III — The Royal Declaration', placeholder: 'Before all the gods and ancestors, he declared...' },
      ],
    },
    {
      id: 'events',
      title: 'The Royal Itinerary',
      subtitle: 'Each ceremony gets its own majestic event card on the invitation',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 6 },
      ],
    },
    {
      id: 'family',
      title: 'The Heritage',
      subtitle: 'Family names displayed in vintage gold-framed medallions on the invitation',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Mr. Suresh Kapoor', 'Mrs. Meena Kapoor'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Mr. Rajveer Singh', 'Mrs. Priya Singh'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Imperial Blessing', placeholder: '"May your union be as eternal as the stars above the palace..."', column: 'full', hint: 'Displayed in calligraphic script on the invitation' },
      ],
    },
    {
      id: 'photos',
      title: 'The Royal Darbar',
      subtitle: 'Your portraits displayed in a masonry gallery with ornate gold frames',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Portraits', maxItems: 6, hint: 'These appear in the gold-framed Darbar gallery section' },
        { key: 'photos.preWedding', type: 'photo-array', label: 'Heritage Shoot', maxItems: 4 },
      ],
    },
    {
      id: 'rsvp',
      title: 'Imperial RSVP',
      subtitle: 'Guests confirm attendance by stamping the royal seal',
      fields: [
        { key: 'rsvp.enabled', type: 'toggle', label: 'Enable RSVP', hint: 'Guests press the Imperial Seal to confirm their attendance' },
      ],
    },
  ],

  defaultFormData: {
    bride: { name: '', photo: null },
    groom: { name: '', photo: null },
    colorMood: 'antique-gold-oxblood',
    loveStory: { howTheyMet: '', specialMoments: '', proposalStory: '' },
    events: [],
    family: { brideParents: ['', ''], groomParents: ['', ''], blessingQuote: '' },
    photos: { couple: Array(6).fill(null), preWedding: Array(4).fill(null) },
    rsvp: { enabled: true },
    designTheme: 'maharaja-gold',
  },

  InvitationComponent: MaharajaGoldInvitation,
};

export default MaharajaGold;

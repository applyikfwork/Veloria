import MidnightSaharaInvitation from '@/components/themes/MidnightSahara';
import type { TemplateModule } from '../types';

const MidnightSahara: TemplateModule = {
  id: 'midnight-sahara',
  designTheme: 'midnight-sahara',
  name: 'Midnight Sahara',
  tagline: 'Desert stars, fort silhouettes & Arabian Nights romance',
  heroEmoji: '✦',
  accentColor: '#D4A843',
  cardGradient: 'from-[#07080F] via-[#1A1535] to-[#07080F]',
  swatches: ['#D4A843', '#07080F', '#C4716A', '#E8CFA0'],
  ceremony: 'wedding',
  style: 'destination',
  region: 'rajasthani',
  mood: 'mysterious',
  music: 'desert-folk',
  tags: ['Desert', 'Destination', 'Stars', 'Rajasthan', 'Cinematic'],
  isPremium: true,
  isNew: true,
  isTrending: false,
  usedByCount: 87,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Desert Stars',
      subtitle: 'Your names written in the stars of the Thar Desert sky',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Zara Rathore', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Photo", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Aryan Shekhawat', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Photo", column: 'right' },
      ],
    },
    {
      id: 'love-story',
      title: 'Your Desert Love Story',
      subtitle: 'Chapters of your story displayed under the night sky',
      fields: [
        { key: 'loveStory.howTheyMet', type: 'textarea', label: 'Chapter I — How did you meet?', placeholder: 'Beneath the dunes of fate, we found...' },
        { key: 'loveStory.specialMoments', type: 'textarea', label: 'Chapter II — Special moments', placeholder: 'Under a blanket of stars, we...' },
        { key: 'loveStory.proposalStory', type: 'textarea', label: 'Chapter III — The proposal', placeholder: 'With the moon as witness...' },
      ],
    },
    {
      id: 'events',
      title: 'The Desert Ceremonies',
      subtitle: 'Each event unfolds like a chapter under the desert sky',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 6 },
      ],
    },
    {
      id: 'family',
      title: 'Family Blessings',
      subtitle: 'Your families united under the desert moon',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Mr. Vikram Rathore', 'Mrs. Priya Rathore'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Mr. Rajveer Shekhawat', 'Mrs. Kamla Shekhawat'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Family Blessing', placeholder: '"Like stars that never fade, may your love light the way forever."', column: 'full' },
      ],
    },
    {
      id: 'photos',
      title: 'Captured Under Stars',
      subtitle: 'Photos in desert-dark frames with golden glow',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6, hint: 'Displayed in the midnight dark gallery' },
        { key: 'photos.preWedding', type: 'photo-array', label: 'Pre-Wedding Shoot', maxItems: 4 },
      ],
    },
    {
      id: 'rsvp',
      title: 'Guest RSVP',
      subtitle: 'Desert-themed RSVP with starfield styling',
      fields: [
        { key: 'rsvp.enabled', type: 'toggle', label: 'Enable RSVP', hint: 'Guests confirm and leave a message from beneath the stars' },
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
    designTheme: 'midnight-sahara',
  },

  InvitationComponent: MidnightSaharaInvitation,
};

export default MidnightSahara;

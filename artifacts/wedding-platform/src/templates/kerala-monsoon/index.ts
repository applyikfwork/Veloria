import KeralaMonsooonInvitation from '@/components/themes/KeralaMonsooon';
import type { TemplateModule } from '../types';

const KeralaMonsooon: TemplateModule = {
  id: 'kerala-monsoon',
  designTheme: 'kerala-monsoon',
  name: 'Kerala Monsoon',
  tagline: 'Temple gold & rain-drop serenity — deep south heritage',
  heroEmoji: '🌿',
  accentColor: '#D4A843',
  cardGradient: 'from-[#0D2B1A] via-[#061510] to-[#020A06]',
  swatches: ['#D4A843', '#4A8B6F', '#0D4A2A', '#F5F0E8'],
  ceremony: 'wedding',
  style: 'traditional',
  region: 'kerala',
  mood: 'romantic',
  music: 'classical',
  tags: ['Kerala', 'Monsoon', 'Temple', 'South Indian', 'Heritage'],
  isPremium: false,
  isNew: true,
  isTrending: false,
  usedByCount: 0,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Couple',
      subtitle: 'Names for your Kerala wedding invitation',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Anjali Nair', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Portrait", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Arjun Menon', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Portrait", column: 'right' },
      ],
    },
    {
      id: 'events',
      title: 'Sacred Ceremonies',
      subtitle: 'Add your Seemantham, Nischayam, Wedding and Reception events',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 6 },
      ],
    },
    {
      id: 'family',
      title: 'Family',
      subtitle: 'Your families united in sacred blessing',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Mr. Suresh Nair', 'Mrs. Radha Nair'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Mr. Rajan Menon', 'Mrs. Geetha Menon'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Family Blessing', placeholder: '"Like the monsoon that blesses the earth, may your love be ever-nourishing."', column: 'full' },
      ],
    },
    {
      id: 'photos',
      title: 'Gallery',
      subtitle: 'Photos to display in your Kerala invitation',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6 },
      ],
    },
    {
      id: 'rsvp',
      title: 'Guest RSVP',
      subtitle: 'Enable RSVP for your guests',
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
    designTheme: 'kerala-monsoon',
  },

  InvitationComponent: KeralaMonsooonInvitation,
};

export default KeralaMonsooon;

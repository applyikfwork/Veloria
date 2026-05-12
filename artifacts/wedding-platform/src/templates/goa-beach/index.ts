import GoaBeachInvitation from '@/components/themes/GoaBeach';
import type { TemplateModule } from '../types';

const GoaBeach: TemplateModule = {
  id: 'goa-beach',
  designTheme: 'goa-beach',
  name: 'Goa Beach',
  tagline: 'Sunset coral, ocean waves & tropical destination bliss',
  heroEmoji: '🌊',
  accentColor: '#E8634A',
  cardGradient: 'from-[#1E3A4A] via-[#1A2E38] to-[#0D1F28]',
  swatches: ['#E8634A', '#1E6B8C', '#2EC4B6', '#F5E6C8'],
  ceremony: 'wedding',
  style: 'destination',
  region: 'destination',
  mood: 'rustic',
  music: 'ambient',
  tags: ['Goa', 'Beach', 'Destination', 'Sunset', 'Tropical', 'Coastal'],
  isPremium: false,
  isNew: true,
  isTrending: false,
  usedByCount: 0,

  wizardSteps: [
    {
      id: 'couple',
      title: 'The Couple',
      subtitle: 'Names for your beach wedding invitation',
      layout: 'two-column',
      fields: [
        { key: 'bride.name', type: 'text', label: "Bride's Full Name", placeholder: 'e.g. Nisha Rodrigues', required: true, column: 'left' },
        { key: 'bride.photo', type: 'photo', label: "Bride's Portrait", column: 'left' },
        { key: 'groom.name', type: 'text', label: "Groom's Full Name", placeholder: 'e.g. Savio Pereira', required: true, column: 'right' },
        { key: 'groom.photo', type: 'photo', label: "Groom's Portrait", column: 'right' },
      ],
    },
    {
      id: 'events',
      title: 'Beach Celebrations',
      subtitle: 'Add your Sundowner, Cocktail Evening, Wedding and After-Party events',
      fields: [
        { key: 'events', type: 'event-list', label: 'Events', maxItems: 6 },
      ],
    },
    {
      id: 'family',
      title: 'Family',
      subtitle: 'Your families on the invitation',
      layout: 'two-column',
      fields: [
        { key: 'family.brideParents', type: 'text-pair', labels: ["Bride's Father", "Bride's Mother"], placeholders: ['Mr. Carlos Rodrigues', 'Mrs. Maria Rodrigues'], column: 'left' },
        { key: 'family.groomParents', type: 'text-pair', labels: ["Groom's Father", "Groom's Mother"], placeholders: ['Mr. Antonio Pereira', 'Mrs. Rosa Pereira'], column: 'right' },
        { key: 'family.blessingQuote', type: 'textarea', label: 'Family Blessing', placeholder: '"Like the ocean, may your love be vast, deep and ever-flowing."', column: 'full' },
      ],
    },
    {
      id: 'photos',
      title: 'Gallery',
      subtitle: 'Beach and couple photos for your invitation',
      fields: [
        { key: 'photos.couple', type: 'photo-array', label: 'Couple Photos', maxItems: 6 },
      ],
    },
    {
      id: 'rsvp',
      title: 'Guest RSVP',
      subtitle: 'Let guests confirm they are coming to the beach!',
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
    designTheme: 'goa-beach',
  },

  InvitationComponent: GoaBeachInvitation,
};

export default GoaBeach;

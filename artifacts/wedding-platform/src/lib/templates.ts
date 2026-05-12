export type WizardStep =
  | 'couple-details'
  | 'family-details'
  | 'events'
  | 'design-customize'
  | 'music'
  | 'photos'
  | 'rsvp'
  | 'live-preview'
  | 'export-share';

export type CustomizableField =
  | 'accent-color'
  | 'music-mood'
  | 'language'
  | 'hashtag'
  | 'dress-code'
  | 'gift-registry'
  | 'live-stream'
  | 'couple-photos'
  | 'family-photos'
  | 'love-story'
  | 'family-message'
  | 'blessing-quote'
  | 'whatsapp-rsvp';

export interface TemplateWizardConfig {
  steps: WizardStep[];
  customizableFields: CustomizableField[];
  requiresPhotos: boolean;
  requiresFamily: boolean;
  requiresLoveStory: boolean;
  maxEvents: number;
  notes?: string;
}

export interface WeddingTemplate {
  id: string;
  name: string;
  tagline: string;
  ceremony: 'wedding' | 'engagement' | 'mehndi' | 'sangeet' | 'haldi' | 'reception';
  style: 'traditional' | 'luxury' | 'minimal' | 'bollywood' | 'destination' | 'festive';
  region: 'north-indian' | 'south-indian' | 'punjabi' | 'bengali' | 'rajasthani' | 'kerala' | 'pan-indian' | 'modern' | 'destination';
  mood: 'romantic' | 'festive' | 'royal' | 'modern' | 'rustic' | 'playful';
  designTheme: string;
  cardGradient: string;
  cardBorder: string;
  accentColor: string;
  swatches: string[];
  music: string;
  tags: string[];
  isPremium: boolean;
  isNew: boolean;
  isTrending: boolean;
  usedByCount: number;
  heroEmoji: string;
  previewBgClass: string;
  wizard: TemplateWizardConfig;
}

const DEFAULT_FULL_WIZARD: TemplateWizardConfig = {
  steps: ['couple-details', 'family-details', 'events', 'design-customize', 'music', 'photos', 'rsvp', 'live-preview', 'export-share'],
  customizableFields: ['accent-color', 'music-mood', 'language', 'hashtag', 'couple-photos', 'family-photos', 'love-story', 'family-message', 'blessing-quote', 'whatsapp-rsvp', 'gift-registry', 'live-stream', 'dress-code'],
  requiresPhotos: true,
  requiresFamily: true,
  requiresLoveStory: true,
  maxEvents: 6,
};

const SHORT_WIZARD: TemplateWizardConfig = {
  steps: ['couple-details', 'events', 'design-customize', 'rsvp', 'export-share'],
  customizableFields: ['accent-color', 'music-mood', 'language', 'whatsapp-rsvp'],
  requiresPhotos: false,
  requiresFamily: false,
  requiresLoveStory: false,
  maxEvents: 2,
};

const MEDIUM_WIZARD: TemplateWizardConfig = {
  steps: ['couple-details', 'family-details', 'events', 'design-customize', 'photos', 'rsvp', 'export-share'],
  customizableFields: ['accent-color', 'music-mood', 'language', 'hashtag', 'couple-photos', 'family-message', 'blessing-quote', 'whatsapp-rsvp', 'gift-registry'],
  requiresPhotos: true,
  requiresFamily: true,
  requiresLoveStory: false,
  maxEvents: 4,
};

export const TEMPLATES: WeddingTemplate[] = [
  {
    id: 'maharaja-gold',
    name: 'Maharaja Gold',
    tagline: 'Regal grandeur meets timeless tradition',
    ceremony: 'wedding',
    style: 'luxury',
    region: 'north-indian',
    mood: 'royal',
    designTheme: 'royal-maharaja',
    cardGradient: 'from-[#1A1200] via-[#3D2B00] to-[#1A1200]',
    cardBorder: 'border-[#D4AF37]/50',
    accentColor: '#D4AF37',
    swatches: ['#D4AF37', '#8B732A', '#1A1200', '#F7E7CE'],
    music: 'romantic',
    tags: ['Most Popular', 'Royal', 'Gold'],
    isPremium: false,
    isNew: false,
    isTrending: true,
    usedByCount: 4821,
    heroEmoji: '👑',
    previewBgClass: 'bg-gradient-to-br from-[#1A1200] via-[#3D2B00] to-[#1A1200]',
    wizard: DEFAULT_FULL_WIZARD,
  },
  {
    id: 'bougainvillea-garden',
    name: 'Bougainvillea Garden',
    tagline: 'Lush florals, soft romance, destination dreams',
    ceremony: 'wedding',
    style: 'destination',
    region: 'destination',
    mood: 'romantic',
    designTheme: 'floral',
    cardGradient: 'from-[#3D0A2E] via-[#7B2D5E] to-[#3D0A2E]',
    cardBorder: 'border-[#FFC0CB]/40',
    accentColor: '#FF6B9D',
    swatches: ['#FF6B9D', '#FFC0CB', '#7B2D5E', '#FFFFFF'],
    music: 'romantic',
    tags: ['New', 'Floral', 'Destination'],
    isPremium: false,
    isNew: true,
    isTrending: true,
    usedByCount: 1203,
    heroEmoji: '🌸',
    previewBgClass: 'bg-gradient-to-br from-[#3D0A2E] via-[#7B2D5E] to-[#3D0A2E]',
    wizard: MEDIUM_WIZARD,
  },
  {
    id: 'midnight-silk',
    name: 'Midnight Silk',
    tagline: 'Dark luxury for unforgettable receptions',
    ceremony: 'reception',
    style: 'luxury',
    region: 'modern',
    mood: 'modern',
    designTheme: 'dark-luxury',
    cardGradient: 'from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F]',
    cardBorder: 'border-white/10',
    accentColor: '#C0C0C0',
    swatches: ['#C0C0C0', '#1A1A2E', '#0A0A0F', '#E8E8E8'],
    music: 'orchestra',
    tags: ['Premium', 'Dark', 'Luxury'],
    isPremium: true,
    isNew: false,
    isTrending: true,
    usedByCount: 2341,
    heroEmoji: '🌙',
    previewBgClass: 'bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F]',
    wizard: MEDIUM_WIZARD,
  },
  {
    id: 'sindoor-dreams',
    name: 'Sindoor Dreams',
    tagline: 'Red & white Bengali elegance',
    ceremony: 'wedding',
    style: 'traditional',
    region: 'bengali',
    mood: 'romantic',
    designTheme: 'bengali',
    cardGradient: 'from-[#3D0000] via-[#8B0000] to-[#3D0000]',
    cardBorder: 'border-white/30',
    accentColor: '#FFFFFF',
    swatches: ['#CC0000', '#FFFFFF', '#8B0000', '#FF6666'],
    music: 'traditional',
    tags: ['Bengali', 'Traditional', 'Red & White'],
    isPremium: false,
    isNew: false,
    isTrending: false,
    usedByCount: 987,
    heroEmoji: '🪷',
    previewBgClass: 'bg-gradient-to-br from-[#3D0000] via-[#8B0000] to-[#3D0000]',
    wizard: DEFAULT_FULL_WIZARD,
  },
  {
    id: 'pastel-bloom',
    name: 'Pastel Bloom',
    tagline: 'Soft pastels, modern romance, clean elegance',
    ceremony: 'engagement',
    style: 'minimal',
    region: 'pan-indian',
    mood: 'romantic',
    designTheme: 'spring-blossom',
    cardGradient: 'from-[#2D1B35] via-[#4A2B50] to-[#2D1B35]',
    cardBorder: 'border-[#CE93D8]/40',
    accentColor: '#CE93D8',
    swatches: ['#F48FB1', '#CE93D8', '#FFFFFF', '#F8BBD0'],
    music: 'romantic',
    tags: ['Engagement', 'Pastel', 'Minimal'],
    isPremium: false,
    isNew: true,
    isTrending: false,
    usedByCount: 654,
    heroEmoji: '💜',
    previewBgClass: 'bg-gradient-to-br from-[#2D1B35] via-[#4A2B50] to-[#2D1B35]',
    wizard: SHORT_WIZARD,
  },
  {
    id: 'sangeet-nights',
    name: 'Sangeet Nights',
    tagline: 'Bollywood lights, dance, and drama',
    ceremony: 'sangeet',
    style: 'bollywood',
    region: 'north-indian',
    mood: 'festive',
    designTheme: 'bollywood',
    cardGradient: 'from-[#2A0010] via-[#6B0030] to-[#2A0010]',
    cardBorder: 'border-[#FF1493]/40',
    accentColor: '#FF1493',
    swatches: ['#FF1493', '#FFD700', '#6B0030', '#FF69B4'],
    music: 'bollywood',
    tags: ['Sangeet', 'Bollywood', '🔥 Trending'],
    isPremium: false,
    isNew: false,
    isTrending: true,
    usedByCount: 3102,
    heroEmoji: '💃',
    previewBgClass: 'bg-gradient-to-br from-[#2A0010] via-[#6B0030] to-[#2A0010]',
    wizard: SHORT_WIZARD,
  },
  {
    id: 'mehndi-magic',
    name: 'Mehndi Magic',
    tagline: 'Earthy hues and intricate patterns',
    ceremony: 'mehndi',
    style: 'festive',
    region: 'rajasthani',
    mood: 'festive',
    designTheme: 'rajasthani',
    cardGradient: 'from-[#1A0A00] via-[#4A2500] to-[#1A0A00]',
    cardBorder: 'border-[#D4AF37]/40',
    accentColor: '#8B6914',
    swatches: ['#8B6914', '#D4AF37', '#4A2500', '#F4A460'],
    music: 'folk',
    tags: ['Mehndi', 'Rajasthani', 'Earthy'],
    isPremium: false,
    isNew: false,
    isTrending: false,
    usedByCount: 1456,
    heroEmoji: '🌿',
    previewBgClass: 'bg-gradient-to-br from-[#1A0A00] via-[#4A2500] to-[#1A0A00]',
    wizard: SHORT_WIZARD,
  },
  {
    id: 'kerala-mural',
    name: 'Kerala Mural',
    tagline: 'Temple art, coconut groves, pure tradition',
    ceremony: 'wedding',
    style: 'traditional',
    region: 'kerala',
    mood: 'royal',
    designTheme: 'south-indian',
    cardGradient: 'from-[#001A00] via-[#003300] to-[#001A00]',
    cardBorder: 'border-[#FFD700]/50',
    accentColor: '#FFD700',
    swatches: ['#FFD700', '#006600', '#FFFFFF', '#FF6600'],
    music: 'classical',
    tags: ['Kerala', 'South Indian', 'Temple'],
    isPremium: false,
    isNew: false,
    isTrending: false,
    usedByCount: 743,
    heroEmoji: '🪔',
    previewBgClass: 'bg-gradient-to-br from-[#001A00] via-[#003300] to-[#001A00]',
    wizard: DEFAULT_FULL_WIZARD,
  },
  {
    id: 'champagne-toast',
    name: 'Champagne Toast',
    tagline: 'Modern luxury for elite receptions',
    ceremony: 'reception',
    style: 'luxury',
    region: 'destination',
    mood: 'modern',
    designTheme: 'premium-minimal',
    cardGradient: 'from-[#1A1400] via-[#2E2400] to-[#1A1400]',
    cardBorder: 'border-[#F5CBA7]/30',
    accentColor: '#F5CBA7',
    swatches: ['#F5CBA7', '#C9B062', '#1A1400', '#FFFFFF'],
    music: 'jazz',
    tags: ['Reception', 'Premium', 'Champagne'],
    isPremium: true,
    isNew: false,
    isTrending: false,
    usedByCount: 892,
    heroEmoji: '🥂',
    previewBgClass: 'bg-gradient-to-br from-[#1A1400] via-[#2E2400] to-[#1A1400]',
    wizard: MEDIUM_WIZARD,
  },
  {
    id: 'haldi-sunshine',
    name: 'Haldi Sunshine',
    tagline: 'Bright, playful, and joyous yellow vibes',
    ceremony: 'haldi',
    style: 'festive',
    region: 'pan-indian',
    mood: 'playful',
    designTheme: 'traditional',
    cardGradient: 'from-[#1A1000] via-[#3D2800] to-[#1A1000]',
    cardBorder: 'border-[#FFD700]/60',
    accentColor: '#FFD700',
    swatches: ['#FFD700', '#FF8C00', '#FFF176', '#FF6B00'],
    music: 'folk',
    tags: ['Haldi', 'Yellow', 'Playful'],
    isPremium: false,
    isNew: false,
    isTrending: false,
    usedByCount: 1834,
    heroEmoji: '☀️',
    previewBgClass: 'bg-gradient-to-br from-[#1A1000] via-[#3D2800] to-[#1A1000]',
    wizard: SHORT_WIZARD,
  },
  {
    id: 'royal-amethyst',
    name: 'Royal Amethyst',
    tagline: 'Deep purple royalty and golden grandeur',
    ceremony: 'wedding',
    style: 'luxury',
    region: 'north-indian',
    mood: 'royal',
    designTheme: 'fantasy-royal',
    cardGradient: 'from-[#0F0020] via-[#2D0060] to-[#0F0020]',
    cardBorder: 'border-[#9B59B6]/50',
    accentColor: '#9B59B6',
    swatches: ['#9B59B6', '#D4AF37', '#2D0060', '#E8DAFF'],
    music: 'orchestra',
    tags: ['Premium', 'Royal', 'Purple'],
    isPremium: true,
    isNew: true,
    isTrending: true,
    usedByCount: 567,
    heroEmoji: '💜',
    previewBgClass: 'bg-gradient-to-br from-[#0F0020] via-[#2D0060] to-[#0F0020]',
    wizard: DEFAULT_FULL_WIZARD,
  },
  {
    id: 'ivory-minimal',
    name: 'Ivory Minimal',
    tagline: 'Clean, modern, effortlessly chic',
    ceremony: 'wedding',
    style: 'minimal',
    region: 'modern',
    mood: 'modern',
    designTheme: 'premium-minimal',
    cardGradient: 'from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]',
    cardBorder: 'border-white/15',
    accentColor: '#F5F5F0',
    swatches: ['#F5F5F0', '#D4D4D0', '#1A1A1A', '#888888'],
    music: 'ambient',
    tags: ['Minimal', 'Clean', 'Modern'],
    isPremium: false,
    isNew: false,
    isTrending: false,
    usedByCount: 2109,
    heroEmoji: '🤍',
    previewBgClass: 'bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]',
    wizard: MEDIUM_WIZARD,
  },
  {
    id: 'tamil-kolam',
    name: 'Tamil Kolam',
    tagline: 'Geometric kolam patterns, vibrant Dravidian spirit',
    ceremony: 'wedding',
    style: 'traditional',
    region: 'south-indian',
    mood: 'festive',
    designTheme: 'south-indian',
    cardGradient: 'from-[#1A0A00] via-[#3D1F00] to-[#1A0A00]',
    cardBorder: 'border-[#FF8C00]/50',
    accentColor: '#FF8C00',
    swatches: ['#FF8C00', '#FFD700', '#8B0000', '#FFFFFF'],
    music: 'classical',
    tags: ['Tamil', 'South Indian', 'Kolam'],
    isPremium: false,
    isNew: false,
    isTrending: false,
    usedByCount: 612,
    heroEmoji: '🪷',
    previewBgClass: 'bg-gradient-to-br from-[#1A0A00] via-[#3D1F00] to-[#1A0A00]',
    wizard: DEFAULT_FULL_WIZARD,
  },
  {
    id: 'punjabi-phulkari',
    name: 'Punjabi Phulkari',
    tagline: 'Bold colours, bhangra energy, pure joy',
    ceremony: 'wedding',
    style: 'festive',
    region: 'punjabi',
    mood: 'festive',
    designTheme: 'punjabi',
    cardGradient: 'from-[#1A0500] via-[#4A1500] to-[#1A0500]',
    cardBorder: 'border-[#FF6600]/50',
    accentColor: '#FF6600',
    swatches: ['#FF6600', '#FFD700', '#8B0000', '#00CC44'],
    music: 'folk',
    tags: ['Punjabi', 'Festive', 'Phulkari'],
    isPremium: false,
    isNew: false,
    isTrending: false,
    usedByCount: 1267,
    heroEmoji: '🎊',
    previewBgClass: 'bg-gradient-to-br from-[#1A0500] via-[#4A1500] to-[#1A0500]',
    wizard: MEDIUM_WIZARD,
  },
  {
    id: 'garden-party',
    name: 'Garden Party',
    tagline: 'Open air, flowers everywhere, afternoon bliss',
    ceremony: 'engagement',
    style: 'destination',
    region: 'destination',
    mood: 'rustic',
    designTheme: 'spring-blossom',
    cardGradient: 'from-[#001A06] via-[#003010] to-[#001A06]',
    cardBorder: 'border-[#90EE90]/40',
    accentColor: '#90EE90',
    swatches: ['#90EE90', '#228B22', '#FFD700', '#FFF0F0'],
    music: 'ambient',
    tags: ['Engagement', 'Garden', 'Outdoor'],
    isPremium: false,
    isNew: true,
    isTrending: false,
    usedByCount: 389,
    heroEmoji: '🌻',
    previewBgClass: 'bg-gradient-to-br from-[#001A06] via-[#003010] to-[#001A06]',
    wizard: SHORT_WIZARD,
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    tagline: 'Celestial romance under a thousand stars',
    ceremony: 'reception',
    style: 'luxury',
    region: 'modern',
    mood: 'romantic',
    designTheme: 'monsoon',
    cardGradient: 'from-[#000010] via-[#000830] to-[#000010]',
    cardBorder: 'border-[#4169E1]/40',
    accentColor: '#4169E1',
    swatches: ['#4169E1', '#C0C0C0', '#000830', '#FFD700'],
    music: 'orchestra',
    tags: ['Reception', 'Stars', 'Night'],
    isPremium: true,
    isNew: false,
    isTrending: true,
    usedByCount: 1876,
    heroEmoji: '⭐',
    previewBgClass: 'bg-gradient-to-br from-[#000010] via-[#000830] to-[#000010]',
    wizard: MEDIUM_WIZARD,
  },
  {
    id: 'crimson-shaadi',
    name: 'Crimson Shaadi',
    tagline: 'Classic deep red Bollywood grandeur',
    ceremony: 'wedding',
    style: 'bollywood',
    region: 'north-indian',
    mood: 'festive',
    designTheme: 'bollywood',
    cardGradient: 'from-[#1A0000] via-[#4A0000] to-[#1A0000]',
    cardBorder: 'border-[#DC143C]/50',
    accentColor: '#DC143C',
    swatches: ['#DC143C', '#D4AF37', '#8B0000', '#FFFFFF'],
    music: 'bollywood',
    tags: ['Wedding', 'Red', 'Bollywood'],
    isPremium: false,
    isNew: false,
    isTrending: true,
    usedByCount: 3567,
    heroEmoji: '❤️',
    previewBgClass: 'bg-gradient-to-br from-[#1A0000] via-[#4A0000] to-[#1A0000]',
    wizard: DEFAULT_FULL_WIZARD,
  },
  {
    id: 'coral-sunset',
    name: 'Coral Sunset',
    tagline: 'Warm coral hues, gentle pastels, engagement bliss',
    ceremony: 'engagement',
    style: 'minimal',
    region: 'pan-indian',
    mood: 'romantic',
    designTheme: 'spring-blossom',
    cardGradient: 'from-[#1A0500] via-[#3D1500] to-[#1A0500]',
    cardBorder: 'border-[#FF7F50]/40',
    accentColor: '#FF7F50',
    swatches: ['#FF7F50', '#FFB347', '#FF6B9D', '#FFF0E6'],
    music: 'romantic',
    tags: ['Engagement', 'Coral', 'Pastel'],
    isPremium: false,
    isNew: true,
    isTrending: false,
    usedByCount: 421,
    heroEmoji: '🌅',
    previewBgClass: 'bg-gradient-to-br from-[#1A0500] via-[#3D1500] to-[#1A0500]',
    wizard: SHORT_WIZARD,
  },
  {
    id: 'bengal-baul',
    name: 'Bengal Baul',
    tagline: 'Mystical folk art and rich cultural soul',
    ceremony: 'wedding',
    style: 'traditional',
    region: 'bengali',
    mood: 'rustic',
    designTheme: 'bengali',
    cardGradient: 'from-[#0A0A00] via-[#2A2000] to-[#0A0A00]',
    cardBorder: 'border-[#CC8800]/50',
    accentColor: '#CC8800',
    swatches: ['#CC8800', '#8B0000', '#FFD700', '#FFFFFF'],
    music: 'folk',
    tags: ['Bengali', 'Folk', 'Cultural'],
    isPremium: false,
    isNew: false,
    isTrending: false,
    usedByCount: 334,
    heroEmoji: '🎭',
    previewBgClass: 'bg-gradient-to-br from-[#0A0A00] via-[#2A2000] to-[#0A0A00]',
    wizard: DEFAULT_FULL_WIZARD,
  },
  {
    id: 'silver-screen',
    name: 'Silver Screen',
    tagline: 'Cinematic Bollywood glamour for receptions',
    ceremony: 'reception',
    style: 'bollywood',
    region: 'modern',
    mood: 'modern',
    designTheme: 'modern-insta',
    cardGradient: 'from-[#0A0015] via-[#1E0035] to-[#0A0015]',
    cardBorder: 'border-[#C0C0C0]/30',
    accentColor: '#C0C0C0',
    swatches: ['#C0C0C0', '#8B008B', '#FFD700', '#000015'],
    music: 'bollywood',
    tags: ['Reception', 'Cinematic', '🔥 Trending'],
    isPremium: true,
    isNew: false,
    isTrending: true,
    usedByCount: 2089,
    heroEmoji: '🎬',
    previewBgClass: 'bg-gradient-to-br from-[#0A0015] via-[#1E0035] to-[#0A0015]',
    wizard: MEDIUM_WIZARD,
  },
];

export const CEREMONY_FILTERS = ['All', 'Wedding', 'Engagement', 'Mehndi', 'Sangeet', 'Haldi', 'Reception'];
export const STYLE_FILTERS = ['All', 'Traditional', 'Luxury', 'Minimal', 'Bollywood', 'Destination', 'Festive'];
export const REGION_FILTERS = ['All', 'North Indian', 'South Indian', 'Punjabi', 'Bengali', 'Rajasthani', 'Kerala', 'Pan Indian', 'Modern', 'Destination'];
export const MOOD_FILTERS = ['All', 'Romantic', 'Festive', 'Royal', 'Modern', 'Rustic', 'Playful'];

export const TRENDING_TEMPLATE_IDS = ['maharaja-gold', 'crimson-shaadi', 'sangeet-nights', 'royal-amethyst'];

export function getTemplateById(id: string): WeddingTemplate | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function filterTemplates(
  templates: WeddingTemplate[],
  {
    ceremony,
    style,
    region,
    search,
    showPremium,
  }: {
    ceremony?: string;
    style?: string;
    region?: string;
    search?: string;
    showPremium?: boolean;
  }
): WeddingTemplate[] {
  return templates.filter(t => {
    if (ceremony && ceremony !== 'All' && t.ceremony !== ceremony.toLowerCase()) return false;
    if (style && style !== 'All' && t.style !== style.toLowerCase()) return false;
    if (region && region !== 'All') {
      const regionKey = region.toLowerCase().replace(' ', '-');
      if (t.region !== regionKey) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.tagline.toLowerCase().includes(q) && !t.tags.some(tag => tag.toLowerCase().includes(q))) {
        return false;
      }
    }
    if (!showPremium && t.isPremium) return false;
    return true;
  });
}

export function getWizardStepLabel(step: WizardStep): string {
  const labels: Record<WizardStep, string> = {
    'couple-details': 'Couple Details',
    'family-details': 'Family Details',
    'events': 'Events',
    'design-customize': 'Customize',
    'music': 'Music',
    'photos': 'Photos',
    'rsvp': 'RSVP',
    'live-preview': 'Preview',
    'export-share': 'Share',
  };
  return labels[step];
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'photo'
  | 'photo-array'
  | 'event-list'
  | 'toggle'
  | 'text-pair'
  | 'choice';

export interface WizardField {
  key: string;
  type: FieldType;
  label?: string;
  labels?: string[];
  placeholder?: string;
  placeholders?: string[];
  hint?: string;
  required?: boolean;
  maxItems?: number;
  column?: 'left' | 'right' | 'full';
  options?: string[];
}

export interface WizardStepConfig {
  id: string;
  title: string;
  subtitle?: string;
  layout?: 'single' | 'two-column';
  fields: WizardField[];
}

export interface TemplateModule {
  id: string;
  designTheme: string;
  name: string;
  tagline: string;
  heroEmoji: string;
  accentColor: string;
  cardGradient: string;
  swatches: string[];
  ceremony: string;
  style: string;
  region: string;
  mood: string;
  music: string;
  tags: string[];
  isPremium: boolean;
  isNew: boolean;
  isTrending: boolean;
  usedByCount: number;
  wizardSteps: WizardStepConfig[];
  defaultFormData: Record<string, any>;
  InvitationComponent: React.ComponentType<{ invitation: any }>;
}

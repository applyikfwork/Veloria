import type { TemplateModule } from './types';
import RoyalNoor from './royal-noor';

export const TEMPLATE_REGISTRY: TemplateModule[] = [
  RoyalNoor,
];

export function getTemplateModule(id: string): TemplateModule | undefined {
  return TEMPLATE_REGISTRY.find(t => t.id === id);
}

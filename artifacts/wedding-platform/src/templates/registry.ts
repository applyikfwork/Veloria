import type { TemplateModule } from './types';
import RoyalNoor from './royal-noor';
import MaharajaGold from './maharaja-gold';
import CrimsonShaadi from './crimson-shaadi';

export const TEMPLATE_REGISTRY: TemplateModule[] = [
  RoyalNoor,
  MaharajaGold,
  CrimsonShaadi,
];

export function getTemplateModule(id: string): TemplateModule | undefined {
  return TEMPLATE_REGISTRY.find(t => t.id === id);
}

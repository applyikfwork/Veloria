import type { TemplateModule } from './types';
import RoyalNoor from './royal-noor';
import MaharajaGold from './maharaja-gold';
import CrimsonShaadi from './crimson-shaadi';
import MarigoldRoyale from './marigold-royale';
import MidnightSahara from './midnight-sahara';
import IvoryBlossom from './ivory-blossom';
import RoseAnand from './rose-anand';
import SindoorVelvet from './sindoor-velvet';
import GujaratiGarba from './gujarati-garba';
import KeralaMonsooon from './kerala-monsoon';
import MarathiPeshwa from './marathi-peshwa';
import NRILondon from './nri-london';
import GoaBeach from './goa-beach';

export const TEMPLATE_REGISTRY: TemplateModule[] = [
  RoyalNoor,
  MaharajaGold,
  CrimsonShaadi,
  MarigoldRoyale,
  MidnightSahara,
  IvoryBlossom,
  RoseAnand,
  SindoorVelvet,
  GujaratiGarba,
  KeralaMonsooon,
  MarathiPeshwa,
  NRILondon,
  GoaBeach,
];

export function getTemplateModule(id: string): TemplateModule | undefined {
  return TEMPLATE_REGISTRY.find(t => t.id === id);
}

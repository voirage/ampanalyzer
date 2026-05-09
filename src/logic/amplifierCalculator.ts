// ============================================================
//  AmpAnalyzer — Moteur de Calcul v3.0
//  Base de données composants + sélection utilisateur
// ============================================================

export interface UserParams {
  targetPower: number;
  loadImpedance: number;
  supplyVoltage: number;
  supplyType: 'Symmetrical' | 'Single';
  ampClass: 'Class AB' | 'Class D';
  ambientTemp: number;
  selectedIC: string;  // ← NOUVEAU : composant choisi par l'utilisateur
}

export interface ComponentSpec {
  label: string;
  value: string;
  note?: string;
}

export interface StageResult {
  stageName: string;
  components: ComponentSpec[];
}

export interface CalculationResults {
  vcc: number;
  vPeak: number;
  iPeak: number;
  iQuiescent: number;
  realPower: number;
  efficiency: number;
  pdTotal: number;
  pdPerDevice: number;
  rthRequired: number;
  tjMax: number;
  heatsinkArea: number;
  stages: StageResult[];
  recommendation: {
    verdict: 'Functional' | 'Risk' | 'Failed';
    warnings: string[];
    suggestions: string[];
  };
  blockDiagram: string[];
}

export interface Analysis {
  id: string;
  date: string;
  power: number;
  impedance: number;
  vcc: number;
  architecture: string;
  verdict: string;
}

// ============================================================
//  BASE DE DONNÉES COMPOSANTS
// ============================================================

export interface ICComponent {
  id: string;   // identifiant unique
  name: string;   // nom affiché
  manufacturer: string;
  type: 'integrated' | 'driver' | 'pwm_ctrl' | 'full_bridge';
  ampClass: 'Class AB' | 'Class D' | 'both';
  vccMin: number;   // V (valeur absolue d'un rail)
  vccMax: number;   // V
  poutMax: number;   // W à RL typique
  rlMin: number;   // Ohm minimum supporté
  efficiency: number;   // % rendement typique
  package: string;
  needsDiscrete: boolean; // true = nécessite transistors externes
  availability: 'Très commune' | 'Commune' | 'Rare';
  notes: string;
}

export interface TransistorComponent {
  id: string;
  name: string;
  type: 'NPN' | 'PNP' | 'N-Ch MOSFET';
  vceMax: number;  // V (Vce pour BJT, Vds pour MOSFET)
  icMax: number;  // A
  pdMax: number;  // W
  package: string;
  hfe?: string;  // BJT gain
  rdsOn?: number;  // mΩ pour MOSFET
  availability: 'Très commune' | 'Commune' | 'Rare';
}

// ── CI Classe AB ─────────────────────────────────────────────
export const CLASS_AB_ICS: ICComponent[] = [
  {
    id: 'LM1875',
    name: 'LM1875',
    manufacturer: 'Texas Instruments',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 16, vccMax: 60, poutMax: 20, rlMin: 4,
    efficiency: 65, package: 'TO-220-5',
    needsDiscrete: false,
    availability: 'Commune',
    notes: 'Idéal debut — simple à câbler — THD < 0.015%'
  },
  {
    id: 'TDA2030A',
    name: 'TDA2030A',
    manufacturer: 'STMicroelectronics',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 12, vccMax: 44, poutMax: 18, rlMin: 4,
    efficiency: 63, package: 'Pentawatt',
    needsDiscrete: false,
    availability: 'Très commune',
    notes: 'Très répandu — économique — facile à trouver partout'
  },
  {
    id: 'TDA2050',
    name: 'TDA2050',
    manufacturer: 'STMicroelectronics',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 14, vccMax: 50, poutMax: 35, rlMin: 4,
    efficiency: 68, package: 'Pentawatt',
    needsDiscrete: false,
    availability: 'Très commune',
    notes: 'Evolution TDA2030 — plus de puissance — même boîtier'
  },
  {
    id: 'TDA2052',
    name: 'TDA2052',
    manufacturer: 'STMicroelectronics',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 16, vccMax: 80, poutMax: 60, rlMin: 4,
    efficiency: 70, package: 'Multiwatt11',
    needsDiscrete: false,
    availability: 'Commune',
    notes: 'Version haute tension — bridge ou stereo possible'
  },
  {
    id: 'LM3876',
    name: 'LM3876',
    manufacturer: 'Texas Instruments',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 20, vccMax: 70, poutMax: 40, rlMin: 4,
    efficiency: 70, package: 'TO-220-7',
    needsDiscrete: false,
    availability: 'Commune',
    notes: 'Overture series TI — Mute intégré — THD < 0.06%'
  },
  {
    id: 'LM3875',
    name: 'LM3875',
    manufacturer: 'Texas Instruments',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 20, vccMax: 94, poutMax: 56, rlMin: 4,
    efficiency: 72, package: 'TO-220-7',
    needsDiscrete: false,
    availability: 'Commune',
    notes: 'Haute tension — compatible ±47V — excellent rendu audio'
  },
  {
    id: 'LM3886',
    name: 'LM3886',
    manufacturer: 'Texas Instruments',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 20, vccMax: 84, poutMax: 68, rlMin: 4,
    efficiency: 73, package: 'TO-220-11 (DIP)',
    needsDiscrete: false,
    availability: 'Commune',
    notes: 'Overture — protection thermique — SPiKe™ — référence audio DIY'
  },
  {
    id: 'TDA7295',
    name: 'TDA7295',
    manufacturer: 'STMicroelectronics',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 20, vccMax: 84, poutMax: 80, rlMin: 4,
    efficiency: 73, package: 'Multiwatt15',
    needsDiscrete: false,
    availability: 'Commune',
    notes: 'Version améliorée TDA7294 — Mute + Standby intégrés'
  },
  {
    id: 'TDA7294',
    name: 'TDA7294',
    manufacturer: 'STMicroelectronics',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 20, vccMax: 100, poutMax: 100, rlMin: 4,
    efficiency: 74, package: 'Multiwatt15',
    needsDiscrete: false,
    availability: 'Très commune',
    notes: 'Très populaire — DMOS output — Mute/Standby — ±50V max'
  },
  {
    id: 'TDA7293',
    name: 'TDA7293',
    manufacturer: 'STMicroelectronics',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 20, vccMax: 100, poutMax: 100, rlMin: 4,
    efficiency: 74, package: 'Multiwatt15',
    needsDiscrete: false,
    availability: 'Commune',
    notes: 'Parallélisable — jusqu\'à 400W en cascade — similaire TDA7294'
  },
  {
    id: 'LM4780',
    name: 'LM4780',
    manufacturer: 'Texas Instruments',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 20, vccMax: 70, poutMax: 120, rlMin: 4,
    efficiency: 72, package: 'DIP-28',
    needsDiscrete: false,
    availability: 'Rare',
    notes: 'Dual/Tri Overture — 2×60W ou mono 120W bridge — rare mais puissant'
  },
  {
    id: 'STK4048XI',
    name: 'STK4048XI',
    manufacturer: 'Sanyo (ON Semi)',
    type: 'integrated',
    ampClass: 'Class AB',
    vccMin: 30, vccMax: 64, poutMax: 150, rlMin: 8,
    efficiency: 68, package: 'Module SIP',
    needsDiscrete: false,
    availability: 'Rare',
    notes: 'Module hybride — tout intégré — répandu dans amplis japonais vintage'
  },
  {
    id: 'DISCRETE_AB',
    name: 'Discret Push-Pull (transistors séparés)',
    manufacturer: 'Universel',
    type: 'driver',
    ampClass: 'Class AB',
    vccMin: 20, vccMax: 120, poutMax: 500, rlMin: 2,
    efficiency: 78, package: 'TO-220 / TO-3 / TO-264',
    needsDiscrete: true,
    availability: 'Très commune',
    notes: 'Puissance illimitée — choix transistors selon la puissance cible'
  },
];

// ── CI Classe D ───────────────────────────────────────────────
export const CLASS_D_ICS: ICComponent[] = [
  {
    id: 'TPA3110D2',
    name: 'TPA3110D2',
    manufacturer: 'Texas Instruments',
    type: 'full_bridge',
    ampClass: 'Class D',
    vccMin: 8, vccMax: 26, poutMax: 30, rlMin: 4,
    efficiency: 92, package: 'HTSSOP-28',
    needsDiscrete: false,
    availability: 'Commune',
    notes: 'Tout intégré — MOSFETs internes — idéal 12V/24V — pas de filtre requis en BTL'
  },
  {
    id: 'TPA3116D2',
    name: 'TPA3116D2',
    manufacturer: 'Texas Instruments',
    type: 'full_bridge',
    ampClass: 'Class D',
    vccMin: 4.5, vccMax: 26, poutMax: 50, rlMin: 4,
    efficiency: 93, package: 'HTSSOP-32 / PSOP',
    needsDiscrete: false,
    availability: 'Très commune',
    notes: 'Très populaire — modules prêts en vente — filtre LC requis — 2×50W'
  },
  {
    id: 'TPA3255',
    name: 'TPA3255',
    manufacturer: 'Texas Instruments',
    type: 'full_bridge',
    ampClass: 'Class D',
    vccMin: 8, vccMax: 52, poutMax: 315, rlMin: 4,
    efficiency: 96, package: 'VQFN-56',
    needsDiscrete: false,
    availability: 'Commune',
    notes: 'Haute performance — 315W — faible THD — filtre LC externe requis'
  },
  {
    id: 'MA12070',
    name: 'MA12070 (Merus)',
    manufacturer: 'Infineon',
    type: 'full_bridge',
    ampClass: 'Class D',
    vccMin: 4, vccMax: 26, poutMax: 40, rlMin: 4,
    efficiency: 96, package: 'QFN-40',
    needsDiscrete: false,
    availability: 'Rare',
    notes: 'Multi-level — rendement exceptionnel — faible EMI — 4×40W'
  },
  {
    id: 'IRS2092S',
    name: 'IRS2092S',
    manufacturer: 'Infineon',
    type: 'pwm_ctrl',
    ampClass: 'Class D',
    vccMin: 10, vccMax: 200, poutMax: 500, rlMin: 2,
    efficiency: 92, package: 'SOIC-16',
    needsDiscrete: true,
    availability: 'Commune',
    notes: 'Contrôleur demi-pont — 400kHz — MOSFETs externes requis — protection overcurrent'
  },
  {
    id: 'IRS2110',
    name: 'IRS2110',
    manufacturer: 'Infineon',
    type: 'pwm_ctrl',
    ampClass: 'Class D',
    vccMin: 10, vccMax: 600, poutMax: 1000, rlMin: 2,
    efficiency: 91, package: 'DIP-14 / SOIC-14',
    needsDiscrete: true,
    availability: 'Très commune',
    notes: 'Gate driver universel — très répandu — associer avec générateur PWM SG3525'
  },
  {
    id: 'SG3525_IRS2110',
    name: 'SG3525 + IRS2110',
    manufacturer: 'TI / Infineon',
    type: 'pwm_ctrl',
    ampClass: 'Class D',
    vccMin: 10, vccMax: 400, poutMax: 800, rlMin: 2,
    efficiency: 90, package: 'DIP-16 + DIP-14',
    needsDiscrete: true,
    availability: 'Très commune',
    notes: 'Combo classique — SG3525 génère PWM — IRS2110 commande les MOSFETs — très accessible'
  },
  {
    id: 'UCD3138',
    name: 'UCD3138',
    manufacturer: 'Texas Instruments',
    type: 'pwm_ctrl',
    ampClass: 'Class D',
    vccMin: 10, vccMax: 100, poutMax: 1000, rlMin: 2,
    efficiency: 95, package: 'QFP-64',
    needsDiscrete: true,
    availability: 'Rare',
    notes: 'Contrôleur numérique DSP — très haute précision — complexe à mettre en œuvre'
  },
  {
    id: 'IR2110',
    name: 'IR2110',
    manufacturer: 'Infineon',
    type: 'pwm_ctrl',
    ampClass: 'Class D',
    vccMin: 10, vccMax: 600, poutMax: 1000, rlMin: 2,
    efficiency: 91, package: 'DIP-14 / SOIC-14',
    needsDiscrete: true,
    availability: 'Très commune',
    notes: 'Version originale IRS2110 — identique en fonctionnement — très disponible en Afrique/Asie'
  },
  {
    id: 'TDA8954TH',
    name: 'TDA8954TH',
    manufacturer: 'NXP',
    type: 'full_bridge',
    ampClass: 'Class D',
    vccMin: 12, vccMax: 50, poutMax: 210, rlMin: 4,
    efficiency: 94, package: 'HSOP-24',
    needsDiscrete: false,
    availability: 'Rare',
    notes: 'Pont complet intégré — 2×105W ou 1×210W BTL — protection complète intégrée'
  },
];

// ── Transistors de sortie (discret AB) ───────────────────────
export const OUTPUT_TRANSISTORS_NPN: TransistorComponent[] = [
  { id: 'TIP31C', name: 'TIP31C', type: 'NPN', vceMax: 100, icMax: 3, pdMax: 40, package: 'TO-220', availability: 'Très commune', notes: 'Petit signal — driver seulement' } as any,
  { id: 'BD139', name: 'BD139', type: 'NPN', vceMax: 80, icMax: 1.5, pdMax: 8, package: 'TO-126', availability: 'Très commune' } as any,
  { id: 'TIP41C', name: 'TIP41C', type: 'NPN', vceMax: 100, icMax: 6, pdMax: 65, package: 'TO-220', availability: 'Très commune' } as any,
  { id: 'TIP3055', name: 'TIP3055', type: 'NPN', vceMax: 60, icMax: 15, pdMax: 90, package: 'TO-220', availability: 'Très commune' } as any,
  { id: 'TIP35C', name: 'TIP35C', type: 'NPN', vceMax: 100, icMax: 25, pdMax: 125, package: 'TO-218', availability: 'Commune' } as any,
  { id: 'MJ15003', name: 'MJ15003', type: 'NPN', vceMax: 140, icMax: 20, pdMax: 250, package: 'TO-3', availability: 'Commune' } as any,
  { id: '2SC5200', name: '2SC5200', type: 'NPN', vceMax: 230, icMax: 15, pdMax: 150, package: 'TO-264', availability: 'Commune' } as any,
  { id: '2SC3281', name: '2SC3281', type: 'NPN', vceMax: 200, icMax: 15, pdMax: 150, package: 'TO-3P', availability: 'Commune' } as any,
  { id: 'MJL21193', name: 'MJL21193', type: 'NPN', vceMax: 250, icMax: 16, pdMax: 200, package: 'TO-264', availability: 'Commune' } as any,
  { id: 'MJL4281A', name: 'MJL4281A', type: 'NPN', vceMax: 350, icMax: 15, pdMax: 230, package: 'TO-264', availability: 'Rare' } as any,
];

// ── MOSFETs Classe D ─────────────────────────────────────────
export const CLASS_D_MOSFETS: TransistorComponent[] = [
  { id: 'IRFZ44N', name: 'IRFZ44N', type: 'N-Ch MOSFET', vceMax: 55, icMax: 49, pdMax: 94, package: 'TO-220', rdsOn: 17, availability: 'Très commune' } as any,
  { id: 'IRF540N', name: 'IRF540N', type: 'N-Ch MOSFET', vceMax: 100, icMax: 33, pdMax: 130, package: 'TO-220', rdsOn: 44, availability: 'Très commune' } as any,
  { id: 'STP80NF55', name: 'STP80NF55', type: 'N-Ch MOSFET', vceMax: 55, icMax: 80, pdMax: 300, package: 'TO-220', rdsOn: 7, availability: 'Commune' } as any,
  { id: 'IRFB4227', name: 'IRFB4227', type: 'N-Ch MOSFET', vceMax: 200, icMax: 65, pdMax: 330, package: 'TO-247', rdsOn: 29, availability: 'Commune' } as any,
  { id: 'IRFB3077', name: 'IRFB3077', type: 'N-Ch MOSFET', vceMax: 75, icMax: 75, pdMax: 330, package: 'TO-220', rdsOn: 2.8, availability: 'Commune' } as any,
  { id: 'IPP80N06S4', name: 'IPP80N06S4', type: 'N-Ch MOSFET', vceMax: 60, icMax: 100, pdMax: 300, package: 'TO-220', rdsOn: 4.5, availability: 'Rare' } as any,
  { id: 'IRFP250N', name: 'IRFP250N', type: 'N-Ch MOSFET', vceMax: 200, icMax: 30, pdMax: 190, package: 'TO-247', rdsOn: 75, availability: 'Commune' } as any,
];

// ── Fonctions utilitaires ────────────────────────────────────
export function getICsForClass(ampClass: 'Class AB' | 'Class D'): ICComponent[] {
  return ampClass === 'Class AB' ? CLASS_AB_ICS : CLASS_D_ICS;
}

export function getICById(id: string): ICComponent | undefined {
  return [...CLASS_AB_ICS, ...CLASS_D_ICS].find(ic => ic.id === id);
}

export function getDefaultIC(ampClass: 'Class AB' | 'Class D', power: number, vcc: number): string {
  const list = getICsForClass(ampClass);
  // Sélection automatique par défaut si l'utilisateur ne choisit pas
  if (ampClass === 'Class AB') {
    if (power <= 20 && vcc <= 25) return 'TDA2030A';
    if (power <= 35 && vcc <= 25) return 'TDA2050';
    if (power <= 40 && vcc <= 35) return 'LM3876';
    if (power <= 68 && vcc <= 42) return 'LM3886';
    if (power <= 100 && vcc <= 50) return 'TDA7294';
    return 'DISCRETE_AB';
  } else {
    if (power <= 30 && vcc <= 24) return 'TPA3116D2';
    if (power <= 100 && vcc <= 50) return 'TPA3255';
    return 'IRS2092S';
  }
}

// ============================================================
//  SÉLECTION TRANSISTORS (inchangée)
// ============================================================
interface TransistorSpec {
  npn: string; pnp: string; pairs: number;
  re: number; icMax: number; vceMax: number;
  pdMaxPerDevice: number; package: string;
}

interface DriverSpec { npn: string; pnp: string; hfe: string; }

function selectOutputTransistors(iPeak: number, vcc: number): TransistorSpec {
  const vceRequired = vcc * 2 * 1.15;
  const icPeak = iPeak * 1.5;

  if (vceRequired <= 52 && icPeak <= 9) {
    const pairs = Math.max(1, Math.ceil(icPeak / 9));
    return {
      npn: 'TIP3055', pnp: 'TIP2955', pairs, re: pairs > 1 ? 0.22 : 0.47,
      icMax: 15, vceMax: 60, pdMaxPerDevice: 90, package: 'TO-220'
    };
  }
  if (vceRequired <= 122 && icPeak <= 12) {
    const pairs = Math.max(1, Math.ceil(icPeak / 12));
    return {
      npn: 'MJ15003', pnp: 'MJ15004', pairs, re: pairs > 1 ? 0.22 : 0.33,
      icMax: 20, vceMax: 140, pdMaxPerDevice: 250, package: 'TO-3'
    };
  }
  if (vceRequired <= 200 && icPeak <= 9) {
    const pairs = Math.max(1, Math.ceil(icPeak / 9));
    return {
      npn: '2SC5200', pnp: '2SA1943', pairs, re: pairs > 1 ? 0.15 : 0.22,
      icMax: 15, vceMax: 230, pdMaxPerDevice: 150, package: 'TO-264'
    };
  }
  if (vceRequired <= 217) {
    const pairs = Math.max(1, Math.ceil(icPeak / 10));
    return {
      npn: 'MJL21193', pnp: 'MJL21194', pairs, re: pairs > 1 ? 0.12 : 0.18,
      icMax: 16, vceMax: 250, pdMaxPerDevice: 200, package: 'TO-264'
    };
  }
  const pairs = Math.max(1, Math.ceil(icPeak / 9));
  return {
    npn: 'MJL4281A', pnp: 'MJL4302A', pairs, re: 0.1,
    icMax: 15, vceMax: 350, pdMaxPerDevice: 230, package: 'TO-264'
  };
}

function selectDriver(pairs: number, iPeak: number): DriverSpec {
  if (pairs === 1 && iPeak <= 4)
    return { npn: 'BC546 / 2N5551', pnp: 'BC556 / 2N5401', hfe: 'hFE > 200' };
  if (pairs <= 2)
    return { npn: 'BD139', pnp: 'BD140', hfe: 'hFE > 40, Ic=1.5A' };
  return { npn: 'MJE340', pnp: 'MJE350', hfe: 'hFE > 30, Ic=500mA' };
}

function selectMOSFET(iPeak: number, vcc: number): { name: string; specs: string } {
  const vdsReq = vcc * 1.5;
  if (iPeak <= 4 && vcc <= 24)
    return { name: 'TPA3116D2 (integre)', specs: 'MOSFETs internes — pas de gate driver' };
  if (vdsReq <= 50 && iPeak <= 30)
    return { name: 'IRFZ44N', specs: `Vds=55V, Id=49A, Rds=17mOhm — requis ${(iPeak * 1.5).toFixed(1)}A` };
  if (vdsReq <= 50 && iPeak <= 50)
    return { name: 'STP80NF55', specs: 'Vds=55V, Id=80A, Rds=7mOhm — charge forte' };
  if (vdsReq <= 185 && iPeak <= 40)
    return { name: 'IRFB4227', specs: 'Vds=200V, Id=65A, Rds=29mOhm — haute tension' };
  return { name: 'IPP80N06S4', specs: 'Vds=60V, Id=100A, Rds=4.5mOhm — forte puissance' };
}

// ============================================================
//  CLASSE AB — CALCUL COMPLET
// ============================================================
function calculateClassAB(p: UserParams): CalculationResults {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const vcc = p.supplyType === 'Symmetrical' ? p.supplyVoltage : p.supplyVoltage / 2;
  const vSat = 2.5;
  const vSwing = vcc - vSat;

  const realPower = (vSwing * vSwing) / (2 * p.loadImpedance);
  const vPeak = Math.sqrt(2 * realPower * p.loadImpedance);
  const iPeak = vPeak / p.loadImpedance;
  const efficiency = Math.min(78.5, (Math.PI / 4) * (vSwing / vcc) * 100);
  const iQuiescent = 35;

  // IC sélectionné par l'utilisateur
  const ic = getICById(p.selectedIC) || getICById(getDefaultIC('Class AB', realPower, vcc))!;

  const transistors = selectOutputTransistors(iPeak, vcc);
  const driver = selectDriver(transistors.pairs, iPeak);

  const pdTotal = (vcc * vcc) / (Math.PI * Math.PI * p.loadImpedance);
  const pdPerDevice = pdTotal / (2 * transistors.pairs);
  const tjMax = 150;
  const rthRequired = (tjMax - p.ambientTemp) / Math.max(pdPerDevice, 0.1);
  const heatsinkArea = pdTotal * (5 + transistors.pairs * 2);

  const rin = 47000;
  const cin = parseFloat((1 / (2 * Math.PI * 20 * rin) * 1e6).toFixed(2));
  const re = transistors.re;
  const ce = Math.round(1 / (2 * Math.PI * 20 * Math.max(re, 0.1)) * 1e3);
  const vBase = 0.65 + (iQuiescent / 1000) * re;
  const rb2 = Math.round((vBase / ((iQuiescent / 1000) * 10)) / 100) * 100;
  const rb1 = Math.round(((vcc - vBase) / ((iQuiescent / 1000) * 10)) / 100) * 100;
  const rDriver = Math.round((vcc / (iPeak * 3)) / 10) * 10;
  const fuseRating = (iPeak * 1.3).toFixed(1);
  const cDecoupling = Math.max(100, Math.ceil(iPeak * 100));

  const stages: StageResult[] = [
    {
      stageName: "1. Entree & Couplage",
      components: [
        { label: "Resistance entree (Rin)", value: `${rin / 1000} kOhm`, note: "Impedance entree standard" },
        { label: "Condensateur couplage (Cin)", value: `${cin} uF`, note: "fc = 20 Hz — bloque le DC" },
        { label: "R1 pont diviseur", value: `${rb1} Ohm`, note: `Vcc=${vcc}V — Iq=${iQuiescent}mA` },
        { label: "R2 pont diviseur", value: `${rb2} Ohm`, note: `Vbase = ${vBase.toFixed(2)} V` },
      ]
    },
    {
      stageName: "2. Etage Driver (Pre-ampli)",
      components: [
        { label: "Transistor driver NPN", value: driver.npn, note: `${driver.hfe}` },
        { label: "Transistor driver PNP", value: driver.pnp, note: "Complementaire push-pull" },
        { label: "Resistance collecteur (Rc)", value: `${rDriver} Ohm`, note: "Charge active driver" },
        { label: "Resistance emetteur driver (Re)", value: `${re.toFixed(2)} Ohm`, note: "Degeneration thermique" },
        { label: "Condensateur bypass (Ce)", value: `${ce} uF`, note: "Gain AC pleine bande" },
      ]
    },
    {
      stageName: `3. Etage Puissance Push-Pull (${transistors.pairs} paire${transistors.pairs > 1 ? 's' : ''})`,
      components: [
        {
          label: `Transistor NPN sortie (${transistors.pairs}x)`,
          value: transistors.npn,
          note: `${transistors.package} — Vce=${transistors.vceMax}V — Ic=${transistors.icMax}A — requis Vce>${(vcc * 2).toFixed(0)}V / Ic>${(iPeak * 1.5).toFixed(1)}A`
        },
        {
          label: `Transistor PNP sortie (${transistors.pairs}x)`,
          value: transistors.pnp,
          note: `Complementaire — meme boitier ${transistors.package}`
        },
        {
          label: `Resistance emetteur (${transistors.pairs * 2}x)`,
          value: `${re.toFixed(2)} Ohm / ${Math.ceil(iPeak * re + 1)} W`,
          note: "Equilibrage courant — anti-emballement thermique"
        },
        { label: "Diodes polarisation (2x)", value: "2x 1N4148 / D44H11", note: "Compensation thermique Vbe" },
        { label: "Dissipateur thermique", value: `>= ${heatsinkArea.toFixed(0)} cm2`, note: `Rth <= ${rthRequired.toFixed(1)} deg C/W` },
      ]
    },
    {
      stageName: "4. CI Principal (choisi par utilisateur)",
      components: [
        {
          label: ic.needsDiscrete ? "Architecture" : "CI amplificateur",
          value: ic.name,
          note: `${ic.manufacturer} — ${ic.package} — max ${ic.poutMax}W — ${ic.notes}`
        },
        { label: "Resistance feedback (Rfb1)", value: "1 kOhm", note: "Fixe le gain" },
        { label: "Resistance feedback (Rfb2)", value: "22 kOhm", note: "Gain = 1+22k/1k = 23x (27 dB)" },
      ]
    },
    {
      stageName: "5. Filtrage & Protection",
      components: [
        { label: "Reseau Zobel", value: `${p.loadImpedance} Ohm + 100 nF`, note: "Stabilite charge inductive" },
        { label: "Fusible sortie", value: `${fuseRating} A rapide`, note: "Protection court-circuit" },
        { label: "Condensateur +VCC", value: `${cDecoupling} uF + 100 nF`, note: `>= ${Math.ceil(vcc * 1.3)}V basse ESR` },
        { label: "Condensateur -VCC", value: `${cDecoupling} uF + 100 nF`, note: "Identique rail positif" },
        { label: "Resistance decharge", value: `${Math.round(vcc / 0.01 / 1000) * 1} kOhm / 2W`, note: "Decharge capa a la mise hors tension" },
      ]
    }
  ];

  // Vérifications
  if (p.targetPower > realPower * 1.05) {
    warnings.push(`Puissance (${p.targetPower}W) > max atteignable (${realPower.toFixed(1)}W) avec Vcc=${vcc}V.`);
    suggestions.push(`Augmentez Vcc a >= ${Math.ceil(Math.sqrt(2 * p.targetPower * p.loadImpedance) + vSat)}V.`);
  }
  if (!ic.needsDiscrete && realPower > ic.poutMax) {
    warnings.push(`${ic.name} limite a ${ic.poutMax}W — puissance demandee (${realPower.toFixed(0)}W) depasse ses specs.`);
    suggestions.push(`Choisissez un CI plus puissant ou selectionnez "Discret Push-Pull".`);
  }
  if (!ic.needsDiscrete && vcc > ic.vccMax) {
    warnings.push(`${ic.name} : Vcc max = ${ic.vccMax}V — votre alimentation (${vcc}V) est trop haute.`);
    suggestions.push(`Reduisez Vcc a <= ${ic.vccMax}V ou choisissez un CI haute tension.`);
  }
  if (transistors.pairs > 1) {
    warnings.push(`${transistors.pairs} paires de transistors en parallele requises — resistances emetteur obligatoires.`);
    suggestions.push(`Montez toutes les paires sur le meme dissipateur.`);
  }
  if (vcc < 12) {
    warnings.push("Tension trop faible (< 12V) — swing insuffisant.");
    suggestions.push("Minimum 15V pour Classe AB.");
  }
  if (pdPerDevice > transistors.pdMaxPerDevice * 0.5) {
    warnings.push(`Dissipation par transistor (${pdPerDevice.toFixed(1)}W) > 50% Pd max.`);
    suggestions.push("Augmentez le nombre de paires ou ameliorez le refroidissement.");
  }

  const verdict: 'Functional' | 'Risk' | 'Failed' =
    warnings.length === 0 ? 'Functional' : warnings.length <= 2 ? 'Risk' : 'Failed';

  return {
    vcc, vPeak: parseFloat(vPeak.toFixed(2)), iPeak: parseFloat(iPeak.toFixed(2)),
    iQuiescent, realPower: parseFloat(realPower.toFixed(1)), efficiency: parseFloat(efficiency.toFixed(1)),
    pdTotal: parseFloat(pdTotal.toFixed(2)), pdPerDevice: parseFloat(pdPerDevice.toFixed(2)),
    rthRequired: parseFloat(rthRequired.toFixed(2)), tjMax,
    heatsinkArea: parseFloat(heatsinkArea.toFixed(0)),
    stages, recommendation: { verdict, warnings, suggestions },
    blockDiagram: ic.needsDiscrete
      ? ['IN', 'Cin/Rin', 'Driver', transistors.npn, `${transistors.pairs}x Push-Pull`, transistors.pnp, 'Zobel', 'LOAD']
      : ['IN', 'Cin/Rin', ic.name, 'Rfb', 'Zobel', 'LOAD']
  };
}

// ============================================================
//  CLASSE D — CALCUL COMPLET
// ============================================================
function calculateClassD(p: UserParams): CalculationResults {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const vcc = p.supplyVoltage;
  const vOutRms = vcc / Math.sqrt(2);
  const realPower = (vOutRms * vOutRms) / p.loadImpedance;
  const vPeak = vcc;
  const iPeak = vPeak / p.loadImpedance;
  const iQuiescent = 12;

  const ic = getICById(p.selectedIC) || getICById(getDefaultIC('Class D', realPower, vcc))!;
  const efficiency = ic.efficiency;

  const pdTotal = realPower * (1 - efficiency / 100);
  const pdPerDevice = pdTotal / 2;
  const tjMax = 150;
  const rthRequired = (tjMax - p.ambientTemp) / Math.max(pdPerDevice, 0.1);
  const heatsinkArea = Math.max(pdTotal * 2, 8);

  const mosfet = ic.needsDiscrete ? selectMOSFET(iPeak, vcc) : { name: 'Interne au CI', specs: 'MOSFETs integres dans le CI' };

  const fSwitching = 400000;
  const fc = 22000;
  const deltaI = Math.max(iPeak * 0.2, 0.05);
  const lFilter = vcc / (8 * fSwitching * deltaI);
  const lUH = parseFloat((lFilter * 1e6).toFixed(2));
  const cFilter = 1 / (Math.pow(2 * Math.PI * fc, 2) * lFilter);
  const cUF = parseFloat((cFilter * 1e6).toFixed(2));
  const rShunt = parseFloat((0.1 / Math.max(iPeak, 0.1)).toFixed(3));
  const cBulk = Math.ceil(iPeak * 150);
  const vBulkRat = Math.ceil(vcc * 1.35);
  const vTVS = Math.ceil(vcc * 1.25);

  const stages: StageResult[] = [
    {
      stageName: "1. Filtre entree & Modulateur PWM",
      components: [
        { label: "Resistance filtre entree (Rin)", value: "10 kOhm", note: "Filtre RC 1er ordre" },
        { label: "Condensateur filtre entree (Cin)", value: "100 nF", note: "Coupure HF entree" },
        {
          label: "CI controleur (choisi utilisateur)",
          value: ic.name,
          note: `${ic.manufacturer} — ${ic.package} — ${ic.notes}`
        },
        { label: "Temps mort (Dead-time)", value: "100 ns", note: "Prevention court-circuit HS/LS" },
        { label: "Resistance de grille (Rg)", value: "22 Ohm", note: "Controle EMI et oscillations" },
        { label: "Condensateur bootstrap", value: "100 nF", note: "Alimentation grille MOSFET haut cote" },
      ]
    },
    {
      stageName: "2. Pont en H — MOSFETs",
      components: [
        { label: "MOSFET haut cote (Q1,Q3)", value: mosfet.name, note: mosfet.specs },
        { label: "MOSFET bas cote (Q2,Q4)", value: mosfet.name, note: "Identique haut cote" },
        { label: "Diodes roue libre", value: "Body diode MOSFET", note: "ou Schottky ext. si trr > 100ns" },
        { label: "Shunt courant (Rs)", value: `${rShunt} Ohm / ${Math.ceil(iPeak * iPeak * rShunt * 2)} W`, note: "Protection overcurrent" },
      ]
    },
    {
      stageName: "3. Filtre LC Sortie (INDISPENSABLE)",
      components: [
        { label: "Inductance filtre (L)", value: `${lUH} uH`, note: `Ondulation < 20% Ipeak — fc = ${fc / 1000}kHz` },
        { label: "Condensateur filtre (C)", value: `${cUF} uF`, note: "Film polypropylene" },
        { label: "Reseau amortissement", value: `${(p.loadImpedance / 2).toFixed(1)} Ohm + ${(cUF * 2).toFixed(1)} uF`, note: "Damping du filtre LC" },
        { label: "Inductance mode commun", value: "22 uH", note: "Reduction EMI differentielle" },
      ]
    },
    {
      stageName: "4. Alimentation & Protection",
      components: [
        { label: "Condensateur de bus (Cbulk)", value: `${cBulk} uF / ${vBulkRat} V`, note: "Electrolytique basse ESR" },
        { label: "Condensateur decouplage", value: "10 uF + 100 nF", note: "Par MOSFET — pres du drain" },
        { label: "TVS protection surtension", value: `${vTVS} V bidirrectionnelle`, note: "Absorbe pics de commutation" },
        { label: "Fusible de bus (F1)", value: `${(iPeak * 1.5).toFixed(1)} A rapide`, note: "Protection court-circuit" },
        { label: "Ferrite de bus (FB)", value: "100 Ohm @ 100MHz", note: "Reduction EMI rayonnee" },
      ]
    }
  ];

  if (p.targetPower > realPower * 1.05) {
    warnings.push(`Puissance (${p.targetPower}W) > max (${realPower.toFixed(1)}W) avec Vbus=${vcc}V.`);
    suggestions.push(`Vbus minimum requis : ${Math.ceil(Math.sqrt(p.targetPower * p.loadImpedance) * Math.sqrt(2) * 1.1)}V.`);
  }
  if (realPower > ic.poutMax) {
    warnings.push(`${ic.name} limite a ${ic.poutMax}W — puissance calculee (${realPower.toFixed(0)}W) depasse ses specs.`);
    suggestions.push(`Choisissez un CI plus puissant dans la liste.`);
  }
  if (vcc > ic.vccMax) {
    warnings.push(`${ic.name} : Vbus max = ${ic.vccMax}V — votre alimentation (${vcc}V) depasse les specs.`);
    suggestions.push(`Reduisez Vbus ou choisissez IRS2092S (200V max) ou IR2110.`);
  }
  if (lUH < 3) {
    warnings.push(`Inductance filtre faible (${lUH}uH) — ondulation elevee.`);
    suggestions.push("Reduisez fs a 200kHz ou augmentez L a >= 10uH.");
  }
  if (vcc < 10) {
    warnings.push(`Tension bus trop faible (${vcc}V).`);
    suggestions.push("Minimum 12V pour Classe D.");
  }

  const verdict: 'Functional' | 'Risk' | 'Failed' =
    warnings.length === 0 ? 'Functional' : warnings.length <= 2 ? 'Risk' : 'Failed';

  return {
    vcc, vPeak: parseFloat(vPeak.toFixed(2)), iPeak: parseFloat(iPeak.toFixed(2)),
    iQuiescent, realPower: parseFloat(realPower.toFixed(1)), efficiency,
    pdTotal: parseFloat(pdTotal.toFixed(2)), pdPerDevice: parseFloat(pdPerDevice.toFixed(2)),
    rthRequired: parseFloat(rthRequired.toFixed(2)), tjMax,
    heatsinkArea: parseFloat(heatsinkArea.toFixed(0)),
    stages, recommendation: { verdict, warnings, suggestions },
    blockDiagram: ['IN', 'RC filtre', ic.name, ic.needsDiscrete ? `H-Bridge ${mosfet.name}` : 'H-Bridge integre', `LC ${lUH}uH/${cUF}uF`, 'LOAD']
  };
}

export function calculateAmplifier(params: UserParams): CalculationResults {
  if (!params.selectedIC) {
    params = {
      ...params,
      selectedIC: getDefaultIC(params.ampClass, params.targetPower, params.supplyVoltage)
    };
  }
  if (params.ampClass === 'Class D') return calculateClassD(params);
  return calculateClassAB(params);
}
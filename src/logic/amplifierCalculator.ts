// ============================================================
//  AmpAnalyzer — Moteur de Calcul Électronique
//  Révision ingénierie rigoureuse v2.0
//  Sélection automatique des composants selon puissance/tension
// ============================================================

export interface UserParams {
  targetPower: number;
  loadImpedance: number;
  supplyVoltage: number;
  supplyType: 'Symmetrical' | 'Single';
  ampClass: 'Class AB' | 'Class D';
  ambientTemp: number;
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
//  SÉLECTION INTELLIGENTE DES COMPOSANTS
// ============================================================

interface TransistorSpec {
  npn: string;
  pnp: string;
  pairs: number;
  re: number;
  icMax: number;
  vceMax: number;
  pdMaxPerDevice: number;
  package: string;
}

interface DriverSpec {
  npn: string;
  pnp: string;
  hfe: string;
}

interface ICSpec {
  name: string;
  useDiscrete: boolean;
  vccMax: number;
  poutMax: number;
  notes: string;
}

// ── Sélection du CI principal selon puissance et tension ──
function selectMainIC(realPower: number, vcc: number): ICSpec {
  // LM3886 : Vcc max ±42V, Pout réel max ~38W@8Ω, ~68W@4Ω
  if (realPower <= 38 && vcc <= 35) {
    return {
      name: 'LM3886',
      useDiscrete: false,
      vccMax: 42,
      poutMax: 68,
      notes: 'CI intégré TO-220 — solution simple jusqu\'à 38W/8Ohm'
    };
  }
  // TDA7294 : Vcc max ±50V, Pout réel max ~70W@8Ω
  if (realPower <= 70 && vcc <= 45) {
    return {
      name: 'TDA7294',
      useDiscrete: false,
      vccMax: 50,
      poutMax: 100,
      notes: 'CI intégré Multiwatt15 — solution compacte jusqu\'à 70W/8Ohm'
    };
  }
  // TDA7293 : Vcc max ±50V, Pout réel max ~100W@8Ω, parallélisable
  if (realPower <= 100 && vcc <= 50) {
    return {
      name: 'TDA7293',
      useDiscrete: false,
      vccMax: 50,
      poutMax: 100,
      notes: 'CI intégré Multiwatt15 — parallélisable pour puissance supérieure'
    };
  }
  // Au-delà : conception discrète obligatoire
  return {
    name: 'Discret Push-Pull multi-paires',
    useDiscrete: true,
    vccMax: 999,
    poutMax: 99999,
    notes: 'Topologie discrète requise — plusieurs paires de transistors en parallèle'
  };
}

// ── Sélection transistors sortie selon tension et courant ──
function selectOutputTransistors(iPeak: number, vcc: number): TransistorSpec {
  // Règles d'ingénierie :
  // Vce requis = 2 × Vcc + marge 15%
  // Ic dérating : utiliser 60% du Ic max
  // Pd dérating : utiliser 50% du Pd max en TO-220, 60% en TO-3/TO-264

  const vceRequired = vcc * 2 * 1.15;
  const icPeak = iPeak * 1.5; // marge sécurité courant

  // TIP3055/TIP2955 : Vce=60V, Ic=15A, Pd=90W (TO-220)
  // Usage sûr : Vce≤52V (vcc≤22V), Ic≤9A par transistor
  if (vceRequired <= 52 && icPeak <= 9) {
    const pairs = Math.max(1, Math.ceil(icPeak / 9));
    return {
      npn: 'TIP3055',
      pnp: 'TIP2955',
      pairs,
      re: pairs > 1 ? 0.22 : 0.47,
      icMax: 15,
      vceMax: 60,
      pdMaxPerDevice: 90,
      package: 'TO-220'
    };
  }

  // MJ15003/MJ15004 : Vce=140V, Ic=20A, Pd=250W (TO-3)
  // Usage sûr : Vce≤122V (vcc≤53V), Ic≤12A par transistor
  if (vceRequired <= 122 && icPeak <= 12) {
    const pairs = Math.max(1, Math.ceil(icPeak / 12));
    return {
      npn: 'MJ15003',
      pnp: 'MJ15004',
      pairs,
      re: pairs > 1 ? 0.22 : 0.33,
      icMax: 20,
      vceMax: 140,
      pdMaxPerDevice: 250,
      package: 'TO-3'
    };
  }

  // 2SC5200/2SA1943 : Vce=230V, Ic=15A, Pd=150W (TO-264)
  // Usage sûr : Vce≤200V (vcc≤87V), Ic≤9A par transistor
  if (vceRequired <= 200 && icPeak <= 9) {
    const pairs = Math.max(1, Math.ceil(icPeak / 9));
    return {
      npn: '2SC5200',
      pnp: '2SA1943',
      pairs,
      re: pairs > 1 ? 0.15 : 0.22,
      icMax: 15,
      vceMax: 230,
      pdMaxPerDevice: 150,
      package: 'TO-264'
    };
  }

  // MJL21193/MJL21194 : Vce=250V, Ic=16A, Pd=200W (TO-264)
  // Usage sûr : Vce≤217V (vcc≤95V), Ic≤10A par transistor
  if (vceRequired <= 217) {
    const pairs = Math.max(1, Math.ceil(icPeak / 10));
    return {
      npn: 'MJL21193',
      pnp: 'MJL21194',
      pairs,
      re: pairs > 1 ? 0.12 : 0.18,
      icMax: 16,
      vceMax: 250,
      pdMaxPerDevice: 200,
      package: 'TO-264'
    };
  }

  // MJL4281A/MJL4302A : Vce=350V, Ic=15A, Pd=230W (TO-264)
  // Pour très haute tension
  const pairs = Math.max(1, Math.ceil(icPeak / 9));
  return {
    npn: 'MJL4281A',
    pnp: 'MJL4302A',
    pairs,
    re: 0.1,
    icMax: 15,
    vceMax: 350,
    pdMaxPerDevice: 230,
    package: 'TO-264'
  };
}

// ── Sélection transistor driver selon nb de paires ──────
function selectDriver(pairs: number, iPeak: number): DriverSpec {
  // 1 paire, faible courant : petits signal suffisent
  if (pairs === 1 && iPeak <= 4) {
    return { npn: 'BC546 / 2N5551', pnp: 'BC556 / 2N5401', hfe: 'hFE > 200' };
  }
  // 1-2 paires, courant moyen : BD139/BD140
  if (pairs <= 2) {
    return { npn: 'BD139', pnp: 'BD140', hfe: 'hFE > 40, Ic=1.5A' };
  }
  // 3+ paires, fort courant : MJE340/MJE350
  return { npn: 'MJE340', pnp: 'MJE350', hfe: 'hFE > 30, Ic=500mA, Vce=300V' };
}

// ── Sélection MOSFET Classe D ────────────────────────────
function selectMOSFET(iPeak: number, vcc: number): { name: string; specs: string } {
  const vdsRequired = vcc * 1.5;
  const idRequired = iPeak * 1.5;

  // TPA3116D2 : solution intégrée jusqu'à 50W
  if (iPeak <= 4 && vcc <= 24) {
    return {
      name: 'TPA3116D2 (intégré)',
      specs: 'CI complet — MOSFETs internes — jusqu\'à 50W'
    };
  }
  // IRFZ44N : Vds=55V, Id=49A, Rds=17mΩ (TO-220)
  if (vdsRequired <= 50 && idRequired <= 30) {
    return {
      name: 'IRFZ44N',
      specs: `Vds=55V, Id=49A, Rds(on)=17mΩ — ${(iPeak * 1.5).toFixed(1)}A requis`
    };
  }
  // STP80NF55 : Vds=55V, Id=80A, Rds=7mΩ (TO-220) — forte charge
  if (vdsRequired <= 50 && idRequired <= 50) {
    return {
      name: 'STP80NF55',
      specs: `Vds=55V, Id=80A, Rds(on)=7mΩ — charge forte courant`
    };
  }
  // IRFB4227 : Vds=200V, Id=65A, Rds=29mΩ (TO-247)
  if (vdsRequired <= 185 && idRequired <= 40) {
    return {
      name: 'IRFB4227',
      specs: `Vds=200V, Id=65A, Rds(on)=29mΩ — haute tension`
    };
  }
  // IPP80N06S4 : Vds=60V, Id=100A, Rds=4.5mΩ — très fort courant
  return {
    name: 'IPP80N06S4',
    specs: `Vds=60V, Id=100A, Rds(on)=4.5mΩ — forte puissance`
  };
}

// ── Sélection CI PWM Classe D ────────────────────────────
function selectPWMController(power: number, vcc: number): { name: string; notes: string } {
  if (power <= 30 && vcc <= 24) {
    return { name: 'TPA3116D2', notes: 'CI intégré complet — pas de MOSFETs externes' };
  }
  if (power <= 300) {
    return { name: 'IRS2092S', notes: 'Gate driver demi-pont — 400kHz — protection overcurrent' };
  }
  if (power <= 1000) {
    return { name: 'UCD3138', notes: 'Contrôleur numérique DSP — haute précision' };
  }
  return { name: 'IRAUDAMP9', notes: 'Module référence Infineon — puissance > 1kW' };
}

// ============================================================
//  CLASSE AB — CALCUL COMPLET
// ============================================================
function calculateClassAB(p: UserParams): CalculationResults {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // ── Tensions ──────────────────────────────────────────────
  const vcc = p.supplyType === 'Symmetrical' ? p.supplyVoltage : p.supplyVoltage / 2;
  const vSat = 2.5;  // chute de saturation transistor
  const vSwing = vcc - vSat;

  // Puissance réelle : P = Vswing² / (2 × RL)
  const realPower = (vSwing * vSwing) / (2 * p.loadImpedance);
  const vPeak = Math.sqrt(2 * realPower * p.loadImpedance);
  const iPeak = vPeak / p.loadImpedance;

  // Rendement théorique Class AB push-pull = π/4 × (Vswing/Vcc)
  const efficiency = Math.min(78.5, (Math.PI / 4) * (vSwing / vcc) * 100);

  // Courant de repos (35mA typique pour Class AB)
  const iQuiescent = 35; // mA

  // ── Sélection des composants ──────────────────────────────
  const icSpec = selectMainIC(realPower, vcc);
  const transistors = selectOutputTransistors(iPeak, vcc);
  const driver = selectDriver(transistors.pairs, iPeak);

  // ── Thermique ─────────────────────────────────────────────
  // Pd max push-pull Class AB = Vcc² / (π² × RL) par paire
  const pdPerPair = (vcc * vcc) / (Math.PI * Math.PI * p.loadImpedance);
  const pdTotal = pdPerPair; // total dans les transistors
  const pdPerDevice = pdTotal / (2 * transistors.pairs); // par transistor

  const tjMax = 150; // °C jonction max standard
  const rthRequired = (tjMax - p.ambientTemp) / Math.max(pdPerDevice, 0.1);
  // Surface dissipateur : règle empirique affinée selon nb paires
  const heatsinkArea = pdTotal * (5 + transistors.pairs * 2);

  // ── Composants passifs ────────────────────────────────────
  // Condensateur de couplage : fc = 20 Hz, Rin = 47kΩ
  const rin = 47000;
  const cin = parseFloat((1 / (2 * Math.PI * 20 * rin) * 1e6).toFixed(2)); // µF

  // Résistance émetteur par transistor (déjà dans transistors.re)
  const re = transistors.re;

  // Bypass émetteur : Ce = 1/(2π×fc×Re)
  const ce = Math.round(1 / (2 * Math.PI * 20 * Math.max(re, 0.1)) * 1e3);

  // Pont diviseur de polarisation
  // Vbase = Vbe + Iq × Re = 0.65 + 0.035 × re
  const vBase = 0.65 + (iQuiescent / 1000) * re;
  const rb2 = Math.round((vBase / ((iQuiescent / 1000) * 10)) / 100) * 100;
  const rb1 = Math.round(((vcc - vBase) / ((iQuiescent / 1000) * 10)) / 100) * 100;

  // Résistance driver (collecteur du préampli)
  const rDriver = Math.round((vcc / (iPeak * 3)) / 10) * 10;

  // Zobel : R = RL, C = L/(RL²) avec L ≈ 25µH typique HP
  const lSpk = 0.000025; // 25µH inductance typique HP
  const rZobel = p.loadImpedance;
  const cZobel = Math.round(lSpk / (p.loadImpedance * p.loadImpedance) * 1e9); // nF

  // Fusible sortie : 1.3 × Ipeak
  const fuseRating = (iPeak * 1.3).toFixed(1);

  // Condensateurs de découplage rail : 100µF × Ipeak/1A minimum
  const cDecoupling = Math.max(100, Math.ceil(iPeak * 100));

  // ── Étages BOM ────────────────────────────────────────────
  const stages: StageResult[] = [
    {
      stageName: '1. Étage d\'entrée & Couplage',
      components: [
        { label: 'Résistance d\'entrée (Rin)', value: `${rin / 1000} kΩ`, note: 'Impédance entrée — standard 47kΩ' },
        { label: 'Condensateur couplage (Cin)', value: `${cin} µF`, note: 'Coupure fc = 20 Hz — bloque le DC' },
        { label: 'R1 pont diviseur polarisation', value: `${rb1} Ω`, note: `Vcc=${vcc}V — Iq=${iQuiescent}mA` },
        { label: 'R2 pont diviseur polarisation', value: `${rb2} Ω`, note: `Vbase = ${vBase.toFixed(2)} V` },
      ]
    },
    {
      stageName: '2. Étage Driver (Pré-amplificateur)',
      components: [
        { label: 'Transistor driver NPN', value: driver.npn, note: `${driver.hfe} — commande base transistors puissance` },
        { label: 'Transistor driver PNP', value: driver.pnp, note: 'Complémentaire — symétrie push-pull' },
        { label: 'Résistance collecteur (Rc)', value: `${rDriver} Ω`, note: 'Charge active driver' },
        { label: 'Résistance émetteur driver (Re)', value: `${re.toFixed(2)} Ω`, note: 'Dégenération — stabilité thermique' },
        { label: 'Condensateur bypass émetteur (Ce)', value: `${ce} µF`, note: 'Gain AC pleine bande' },
      ]
    },
    {
      stageName: `3. Étage Puissance Push-Pull (${transistors.pairs} paire${transistors.pairs > 1 ? 's' : ''} en parallèle)`,
      components: [
        {
          label: `Transistor NPN sortie (${transistors.pairs}×)`,
          value: transistors.npn,
          note: `${transistors.package} — Vce=${transistors.vceMax}V — Ic=${transistors.icMax}A — Pd=${transistors.pdMaxPerDevice}W — requis: Vce>${(vcc * 2).toFixed(0)}V / Ic>${(iPeak * 1.5).toFixed(1)}A`
        },
        {
          label: `Transistor PNP sortie (${transistors.pairs}×)`,
          value: transistors.pnp,
          note: `Complémentaire ${transistors.npn} — même boîtier ${transistors.package}`
        },
        {
          label: `Résistance émetteur par transistor (${transistors.pairs * 2}×)`,
          value: `${re.toFixed(2)} Ω / ${Math.ceil(iPeak * re + 1)} W`,
          note: 'Équilibrage courant entre paires parallèles — anti-emballement thermique'
        },
        {
          label: 'Diodes de polarisation (2×)',
          value: `${transistors.pairs > 1 ? '1N4148 + D44H11' : '2× 1N4148'}`,
          note: 'Compensation thermique Vbe — montées sur dissipateur'
        },
        {
          label: 'Dissipateur thermique',
          value: `≥ ${heatsinkArea.toFixed(0)} cm²`,
          note: `Rth ≤ ${rthRequired.toFixed(1)} °C/W — ${transistors.pairs > 1 ? 'commun toutes paires' : 'TO-220 standard'}`
        },
      ]
    },
    {
      stageName: '4. CI Principal (selon puissance)',
      components: [
        {
          label: icSpec.useDiscrete ? 'Architecture' : 'CI amplificateur',
          value: icSpec.name,
          note: icSpec.notes
        },
        {
          label: 'Résistance feedback (Rfb1)',
          value: '1 kΩ',
          note: 'Fixe le gain — indépendant de la puissance'
        },
        {
          label: 'Résistance feedback (Rfb2)',
          value: '22 kΩ',
          note: 'Gain = 1 + 22k/1k = 23× ≈ 27 dB'
        },
      ]
    },
    {
      stageName: '5. Filtrage, Protection & Alimentation',
      components: [
        {
          label: 'Réseau Zobel (R + C)',
          value: `${rZobel} Ω + ${cZobel} nF`,
          note: 'Stabilité charge inductive — en parallèle avec HP'
        },
        {
          label: 'Fusible de sortie',
          value: `${fuseRating} A rapide`,
          note: 'Protection court-circuit — câblé en série sortie'
        },
        {
          label: 'Condensateur découplage +VCC',
          value: `${cDecoupling} µF + 100 nF`,
          note: `Électrolytique basse ESR + film polyester — ≥ ${Math.ceil(vcc * 1.3)} V`
        },
        {
          label: 'Condensateur découplage -VCC',
          value: `${cDecoupling} µF + 100 nF`,
          note: 'Identique rail positif — symétrique'
        },
        {
          label: 'Résistance de décharge (Rbl)',
          value: `${Math.round(vcc / 0.01 / 1000) * 1000 / 1000} kΩ / 2W`,
          note: 'Décharge condensateurs à la mise hors tension'
        },
      ]
    }
  ];

  // ── Avertissements engineering ────────────────────────────
  if (p.targetPower > realPower * 1.05) {
    warnings.push(`Puissance demandée (${p.targetPower}W) > puissance réelle atteignable (${realPower.toFixed(1)}W) avec Vcc=${vcc}V / ${p.loadImpedance}Ω.`);
    suggestions.push(`Augmentez Vcc à ≥ ${Math.ceil(Math.sqrt(2 * p.targetPower * p.loadImpedance) + vSat)}V.`);
  }
  if (!icSpec.useDiscrete && realPower > icSpec.poutMax * 0.9) {
    warnings.push(`${icSpec.name} proche de sa limite (${icSpec.poutMax}W max) — dissipation thermique critique.`);
    suggestions.push(`Ajoutez un ventilateur forcé ou passez à une topologie discrète.`);
  }
  if (transistors.pairs > 1) {
    warnings.push(`${transistors.pairs} paires de transistors en parallèle requises — résistances d'émetteur obligatoires pour l'équilibrage.`);
    suggestions.push(`Montez toutes les paires sur le même dissipateur — couplage thermique essentiel.`);
  }
  if (vcc < 12) {
    warnings.push(`Tension d'alimentation trop faible (< 12V) — swing insuffisant.`);
    suggestions.push(`Minimum 15V pour une Classe AB exploitable.`);
  }
  if (p.loadImpedance < 4) {
    warnings.push(`Charge ${p.loadImpedance}Ω : courant crête (${iPeak.toFixed(1)}A) — surdimensionnement requis.`);
    suggestions.push(`Utilisez 3+ paires et des transistors Ic > 15A.`);
  }
  if (pdPerDevice > transistors.pdMaxPerDevice * 0.5) {
    warnings.push(`Dissipation par transistor (${pdPerDevice.toFixed(1)}W) > 50% Pd max — dérating insuffisant.`);
    suggestions.push(`Augmentez le nombre de paires ou améliorez le refroidissement.`);
  }

  const verdict: 'Functional' | 'Risk' | 'Failed' =
    warnings.length === 0 ? 'Functional' : warnings.length <= 2 ? 'Risk' : 'Failed';

  return {
    vcc,
    vPeak: parseFloat(vPeak.toFixed(2)),
    iPeak: parseFloat(iPeak.toFixed(2)),
    iQuiescent,
    realPower: parseFloat(realPower.toFixed(1)),
    efficiency: parseFloat(efficiency.toFixed(1)),
    pdTotal: parseFloat(pdTotal.toFixed(2)),
    pdPerDevice: parseFloat(pdPerDevice.toFixed(2)),
    rthRequired: parseFloat(rthRequired.toFixed(2)),
    tjMax,
    heatsinkArea: parseFloat(heatsinkArea.toFixed(0)),
    stages,
    recommendation: { verdict, warnings, suggestions },
    blockDiagram: icSpec.useDiscrete
      ? ['IN', 'Cin/Rin', 'Driver', transistors.npn, `${transistors.pairs}× Push-Pull`, transistors.pnp, 'Zobel', 'LOAD']
      : ['IN', 'Cin/Rin', icSpec.name, 'Rfb', 'Zobel', 'LOAD']
  };
}

// ============================================================
//  CLASSE D — CALCUL COMPLET
// ============================================================
function calculateClassD(p: UserParams): CalculationResults {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const vcc = p.supplyVoltage;
  // Pont complet (BTL) : Vout_rms = Vbus / sqrt(2)
  const vOutRms = vcc / Math.sqrt(2);
  const realPower = (vOutRms * vOutRms) / p.loadImpedance;
  const vPeak = vcc;
  const iPeak = vPeak / p.loadImpedance;

  // Rendement Classe D : 88-95% selon la fréquence de découpage
  // η = 1 - (Rds_on × Ic² + Qg × Vgs × fs) / Pout
  // Estimation empirique affinée par niveau de puissance
  const efficiency = realPower > 200 ? 90 : realPower > 100 ? 92 : 94;
  const iQuiescent = 12; // mA (courant repos contrôleur)

  const pdTotal = realPower * (1 - efficiency / 100);
  const pdPerDevice = pdTotal / 2;
  const tjMax = 150;
  const rthRequired = (tjMax - p.ambientTemp) / Math.max(pdPerDevice, 0.1);
  const heatsinkArea = Math.max(pdTotal * 2, 8);

  // ── Sélection composants ──────────────────────────────────
  const pwmCtrl = selectPWMController(realPower, vcc);
  const mosfet = selectMOSFET(iPeak, vcc);

  // ── Filtre LC de sortie ───────────────────────────────────
  // fs = 400kHz, fc = 22kHz
  // ΔI = 20% × Ipeak (ondulation acceptable)
  // L = Vbus / (8 × fs × ΔI)
  const fSwitching = 400000;
  const fc = 22000;
  const deltaI = Math.max(iPeak * 0.2, 0.05);
  const lFilter = vcc / (8 * fSwitching * deltaI);
  const lUH = parseFloat((lFilter * 1e6).toFixed(2));

  // C = 1 / ((2π×fc)² × L) pour fc = 22kHz
  const cFilter = 1 / (Math.pow(2 * Math.PI * fc, 2) * lFilter);
  const cUF = parseFloat((cFilter * 1e6).toFixed(2));

  // Vérification facteur Q du filtre (amortissement)
  // Q = sqrt(L/C) / RL — idéalement Q < 0.7 (critique)
  const qFactor = Math.sqrt(lFilter / cFilter) / p.loadImpedance;

  // Résistance d'amortissement Zobel pour LC
  const rdamp = parseFloat((Math.sqrt(lFilter / cFilter) / 2).toFixed(1));
  const cdamp = parseFloat((cUF * 2).toFixed(2));

  // Bootstrap : 100nF minimum
  const cBoot = 100;

  // Résistance de grille : compromis EMI / vitesse commutation
  // Rg = Qg / (Ig × ton) — typiquement 10-33Ω selon MOSFET
  const rGate = realPower > 200 ? 10 : realPower > 100 ? 15 : 22;

  // Dead-time : t_dead > t_off(MOSFET) + marge 30%
  const deadTime = 100; // ns (standard IRS2092S)

  // Shunt courant : Rs = 0.1V / Ipeak (chute tension ≤ 100mV)
  const rShunt = parseFloat((0.1 / Math.max(iPeak, 0.1)).toFixed(3));

  // Condensateur de bus : Cbulk = Ipeak × 100µF/A minimum
  // + marge 50% pour les transitoires
  const cBulk = Math.ceil(iPeak * 150);
  const vBulkRat = Math.ceil(vcc * 1.35); // tension nominale condensateur bus

  // TVS : tension = Vbus × 1.2 (absorbe les surtensions de commutation)
  const vTVS = Math.ceil(vcc * 1.25);

  // Inductance de mode commun : réduit EMI différentielle
  const lCM = realPower > 100 ? '47 µH' : '22 µH';

  // ── Étages BOM ────────────────────────────────────────────
  const stages: StageResult[] = [
    {
      stageName: '1. Filtre RC d\'entrée & Modulateur PWM',
      components: [
        { label: 'Résistance filtre entrée (Rin)', value: '10 kΩ', note: 'Filtre RC anti-repliement — 1er ordre' },
        { label: 'Condensateur filtre entrée (Cin)', value: '100 nF', note: `fc_RC = ${(1 / (2 * Math.PI * 10000 * 0.0000001) / 1000).toFixed(1)} kHz` },
        { label: 'CI contrôleur PWM', value: pwmCtrl.name, note: `${pwmCtrl.notes} — fs = ${fSwitching / 1000}kHz` },
        { label: 'Temps mort (Dead-time)', value: `${deadTime} ns`, note: 'Prévention court-circuit HS/LS — réglable IRS2092S' },
        { label: 'Résistance de grille (Rg)', value: `${rGate} Ω`, note: 'Contrôle EMI et oscillations de commutation' },
        { label: 'Condensateur bootstrap (Cboot)', value: `${cBoot} nF`, note: 'Alimentation grille MOSFET haut côté' },
      ]
    },
    {
      stageName: '2. Pont en H — MOSFETs de puissance',
      components: [
        {
          label: 'MOSFET N-Ch haut côté (Q1, Q3)',
          value: mosfet.name,
          note: mosfet.specs
        },
        {
          label: 'MOSFET N-Ch bas côté (Q2, Q4)',
          value: mosfet.name,
          note: 'Identique haut côté — pont complet symétrique'
        },
        {
          label: 'Diodes de roue libre',
          value: 'Body diode MOSFET interne',
          note: 'Si trr > 100ns : ajouter Schottky externe STPS30L60 en parallèle'
        },
        {
          label: 'Shunt de courant (Rs)',
          value: `${rShunt} Ω / ${Math.ceil(iPeak * iPeak * rShunt * 2)} W`,
          note: `Vsense = ${(iPeak * rShunt * 1000).toFixed(0)} mV crête — protection overcurrent`
        },
      ]
    },
    {
      stageName: '3. Filtre LC de Sortie (INDISPENSABLE)',
      components: [
        {
          label: 'Inductance de filtre (L)',
          value: `${lUH} µH`,
          note: `Ondulation ΔI = ${(deltaI).toFixed(2)}A (20% Ipeak) — fc = ${fc / 1000}kHz`
        },
        {
          label: 'Condensateur de filtre (C)',
          value: `${cUF} µF`,
          note: `Film polypropylène — Q = ${qFactor.toFixed(2)} ${qFactor < 0.8 ? '✓ amorti' : '⚠ sur-amorti'}`
        },
        {
          label: 'Réseau d\'amortissement Rd+Cd',
          value: `${rdamp} Ω + ${cdamp} µF`,
          note: 'Damping du filtre LC — évite résonance à vide'
        },
        {
          label: 'Inductance mode commun (LCM)',
          value: lCM,
          note: 'Réduction EMI conduite — obligatoire CE/FCC'
        },
      ]
    },
    {
      stageName: '4. Alimentation, Bus & Protection',
      components: [
        {
          label: 'Condensateur de bus (Cbulk)',
          value: `${cBulk} µF / ${vBulkRat} V`,
          note: `Électrolytique basse ESR (< 50mΩ) — absorption transitoires Ipeak = ${iPeak.toFixed(1)}A`
        },
        {
          label: 'Condensateur découplage MOSFET',
          value: '10 µF + 100 nF',
          note: 'Par MOSFET — proche drain — Film + Céramique X7R'
        },
        {
          label: 'TVS protection surtension',
          value: `${vTVS} V bidirectionnelle`,
          note: `Absorbe pics de commutation — P3V3S ou 1.5KE${vTVS}A`
        },
        {
          label: 'Fusible de bus (F1)',
          value: `${(iPeak * 1.5).toFixed(1)} A rapide`,
          note: 'Protection court-circuit — fusible rapide type gG/gR'
        },
        {
          label: 'Ferrite de bus (FB)',
          value: '100Ω @ 100MHz',
          note: 'Réduction EMI rayonnée sur le bus DC'
        },
      ]
    }
  ];

  // ── Avertissements engineering ────────────────────────────
  if (p.targetPower > realPower * 1.05) {
    warnings.push(`Puissance demandée (${p.targetPower}W) > max atteignable (${realPower.toFixed(1)}W) avec Vbus=${vcc}V / ${p.loadImpedance}Ω.`);
    suggestions.push(`Vbus minimum requis : ${Math.ceil(Math.sqrt(p.targetPower * p.loadImpedance) * Math.sqrt(2) * 1.1)}V.`);
  }
  if (lUH < 3) {
    warnings.push(`Inductance filtre faible (${lUH}µH) — ondulation courant élevée (${(deltaI).toFixed(2)}A).`);
    suggestions.push(`Réduisez fs à 200kHz ou augmentez L à ≥ 10µH.`);
  }
  if (qFactor > 0.9) {
    warnings.push(`Facteur Q du filtre LC = ${qFactor.toFixed(2)} — risque de résonance et distorsion HF.`);
    suggestions.push(`Augmentez le réseau d'amortissement : Rd = ${(rdamp * 1.5).toFixed(1)}Ω.`);
  }
  if (p.loadImpedance < 4) {
    warnings.push(`Charge ${p.loadImpedance}Ω : courant de commutation (${iPeak.toFixed(1)}A crête) — EMI sévères.`);
    suggestions.push(`MOSFETs Rds(on) < 5mΩ et Rg = 10Ω maximum.`);
  }
  if (vcc < 12) {
    warnings.push(`Tension de bus trop faible (${vcc}V) — pertes de commutation dominantes.`);
    suggestions.push(`Vbus minimum recommandé : 15V pour Classe D.`);
  }
  if (vcc > 80) {
    warnings.push(`Tension bus élevée (${vcc}V) — sélectionnez des MOSFETs Vds ≥ ${Math.ceil(vcc * 1.5)}V avec Rds(on) < 50mΩ.`);
  }

  const verdict: 'Functional' | 'Risk' | 'Failed' =
    warnings.length === 0 ? 'Functional' : warnings.length <= 2 ? 'Risk' : 'Failed';

  return {
    vcc,
    vPeak: parseFloat(vPeak.toFixed(2)),
    iPeak: parseFloat(iPeak.toFixed(2)),
    iQuiescent,
    realPower: parseFloat(realPower.toFixed(1)),
    efficiency,
    pdTotal: parseFloat(pdTotal.toFixed(2)),
    pdPerDevice: parseFloat(pdPerDevice.toFixed(2)),
    rthRequired: parseFloat(rthRequired.toFixed(2)),
    tjMax,
    heatsinkArea: parseFloat(heatsinkArea.toFixed(0)),
    stages,
    recommendation: { verdict, warnings, suggestions },
    blockDiagram: ['IN', 'RC filtre', pwmCtrl.name, `H-Bridge\n${mosfet.name}`, `LC\n${lUH}µH/${cUF}µF`, 'LOAD']
  };
}

// ============================================================
//  POINT D'ENTRÉE
// ============================================================
export function calculateAmplifier(params: UserParams): CalculationResults {
  if (params.ampClass === 'Class D') return calculateClassD(params);
  return calculateClassAB(params);
}
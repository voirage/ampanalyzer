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

function calculateClassAB(p: UserParams): CalculationResults {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const vcc = p.supplyType === 'Symmetrical' ? p.supplyVoltage : p.supplyVoltage / 2;
  const vSat = 2.5;
  const vSwing = vcc - vSat;
  const realPower = (vSwing * vSwing) / (2 * p.loadImpedance);
  const vPeak = Math.sqrt(2 * realPower * p.loadImpedance);
  const iPeak = vPeak / p.loadImpedance;
  const efficiency = Math.min(78.5, (realPower / ((vcc * iPeak * 2) / Math.PI)) * 100);
  const iQuiescent = 35;
  const pdTotal = (vcc * vcc) / (Math.PI * Math.PI * p.loadImpedance);
  const pdPerDevice = pdTotal / 2;
  const tjMax = 150;
  const rthRequired = (tjMax - p.ambientTemp) / Math.max(pdPerDevice, 0.1);
  const heatsinkArea = pdTotal * 5;

  const re = Math.max(0.22, Math.min(1.0, 0.65 / (iQuiescent / 1000 * 10)));
  const rb1 = Math.round((vcc * 0.1) / (iQuiescent / 1000 * 10)) * 100;
  const rb2 = Math.round(rb1 / 9) * 10;
  const rin = 47000;
  const cin = parseFloat((1 / (2 * Math.PI * 20 * rin) * 1e6).toFixed(2));
  const ce = Math.round(1 / (2 * Math.PI * 20 * re) * 1e3);
  const rDriver = Math.round(vcc / (iPeak * 5)) * 10;
  const lComp = parseFloat((p.loadImpedance / (2 * Math.PI * 100000) * 1e6).toFixed(2));

  const stages: StageResult[] = [
    {
      stageName: "1. Étage d'entrée & Polarisation",
      components: [
        { label: "Résistance d'entrée (Rin)", value: `${rin / 1000} kΩ`, note: "Adaptation impédance entrée" },
        { label: 'Condensateur de couplage (Cin)', value: `${cin} µF`, note: 'Coupure basse fréq. à 20 Hz' },
        { label: 'R1 (pont diviseur)', value: `${rb1} Ω` },
        { label: 'R2 (pont diviseur)', value: `${rb2} Ω` },
      ]
    },
    {
      stageName: '2. Étage de Gain (Driver)',
      components: [
        { label: 'Transistor driver', value: 'BC546 / 2N5551', note: 'NPN petits signaux, ft > 100 MHz' },
        { label: 'Résistance collecteur (Rc)', value: `${rDriver} Ω` },
        { label: 'Résistance émetteur (Re)', value: `${re.toFixed(2)} Ω`, note: 'Dégenération thermique' },
        { label: 'Cond. bypass émetteur (Ce)', value: `${ce} µF` },
      ]
    },
    {
      stageName: '3. Étage de Puissance (Push-Pull)',
      components: [
        { label: 'Transistor NPN', value: 'TIP3055 / MJ15003', note: `Vce > ${(vcc * 2).toFixed(0)} V, Ic > ${(iPeak * 1.5).toFixed(1)} A` },
        { label: 'Transistor PNP', value: 'TIP2955 / MJ15004', note: 'Complémentaire' },
        { label: 'Résistance émetteur (Remit)', value: `${re.toFixed(2)} Ω / 2 W`, note: 'Équilibrage courant' },
        { label: 'Diodes de polarisation', value: '2× 1N4148 / D44H11', note: 'Compensation thermique Vbe' },
        { label: 'Dissipateur thermique', value: `≥ ${heatsinkArea.toFixed(0)} cm²`, note: `Rth ≤ ${rthRequired.toFixed(1)} °C/W` },
      ]
    },
    {
      stageName: '4. Filtrage & Protection',
      components: [
        { label: 'Inductance de Zobel (L)', value: `${lComp} µH`, note: 'Stabilité charge inductive' },
        { label: 'Réseau Zobel (R+C)', value: '10 Ω + 100 nF', note: 'En parallèle avec la charge' },
        { label: 'Fusible de sortie', value: `${(iPeak * 1.3).toFixed(1)} A`, note: 'Protection court-circuit' },
        { label: 'Condensateur de découplage', value: '100 µF + 100 nF', note: "Sur chaque rail d'alim." },
      ]
    }
  ];

  if (p.targetPower > realPower * 1.05) {
    warnings.push(`Puissance demandée (${p.targetPower} W) > max atteignable (${realPower.toFixed(1)} W) avec Vcc = ${vcc} V.`);
    suggestions.push(`Augmentez Vcc à ≥ ${Math.ceil(Math.sqrt(2 * p.targetPower * p.loadImpedance) + vSat)} V.`);
  }
  if (vcc < 12) {
    warnings.push("Tension d'alimentation trop faible (< 12 V).");
    suggestions.push('Utilisez une alimentation ≥ 15 V pour la Classe AB.');
  }
  if (p.loadImpedance < 4) {
    warnings.push(`Charge ${p.loadImpedance} Ω : courant crête élevé (${iPeak.toFixed(1)} A).`);
    suggestions.push('Transistors avec Ic > 10 A requis.');
  }
  if (pdPerDevice > 50) {
    warnings.push(`Dissipation par transistor élevée (${pdPerDevice.toFixed(1)} W).`);
  }

  const verdict: 'Functional' | 'Risk' | 'Failed' =
    warnings.length === 0 ? 'Functional' : warnings.length <= 2 ? 'Risk' : 'Failed';

  return {
    vcc, vPeak: parseFloat(vPeak.toFixed(2)), iPeak: parseFloat(iPeak.toFixed(2)),
    iQuiescent, realPower: parseFloat(realPower.toFixed(1)), efficiency: parseFloat(efficiency.toFixed(1)),
    pdTotal: parseFloat(pdTotal.toFixed(2)), pdPerDevice: parseFloat(pdPerDevice.toFixed(2)),
    rthRequired: parseFloat(rthRequired.toFixed(2)), tjMax, heatsinkArea: parseFloat(heatsinkArea.toFixed(0)),
    stages, recommendation: { verdict, warnings, suggestions },
    blockDiagram: ['IN', 'Cin', 'Driver NPN', 'Driver PNP', 'NPN Out', 'PNP Out', 'Zobel', 'LOAD']
  };
}

function calculateClassD(p: UserParams): CalculationResults {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const vcc = p.supplyVoltage;
  const vOutRms = vcc / Math.sqrt(2);
  const realPower = (vOutRms * vOutRms) / p.loadImpedance;
  const vPeak = vcc;
  const iPeak = vPeak / p.loadImpedance;
  const efficiency = 92.0;
  const iQuiescent = 10;
  const pdTotal = realPower * (1 - efficiency / 100);
  const pdPerDevice = pdTotal / 2;
  const tjMax = 150;
  const rthRequired = (tjMax - p.ambientTemp) / Math.max(pdPerDevice, 0.1);
  const heatsinkArea = Math.max(pdTotal * 2, 10);

  const fSwitching = 400000;
  const fc = 22000;
  const deltaI = iPeak * 0.2;
  const lFilter = vcc / (8 * fSwitching * Math.max(deltaI, 0.01));
  const lFilterUH = parseFloat((lFilter * 1e6).toFixed(2));
  const cFilter = 1 / (Math.pow(2 * Math.PI * fc, 2) * lFilter);
  const cFilterUF = parseFloat((cFilter * 1e6).toFixed(2));
  const rShunt = parseFloat((0.1 / Math.max(iPeak, 0.1)).toFixed(3));
  const cBulk = Math.ceil(iPeak * 100);

  const stages: StageResult[] = [
    {
      stageName: '1. Modulateur PWM',
      components: [
        { label: 'CI contrôleur PWM', value: 'IRS2092 / TPA3116', note: `Fréq. découpage : ${fSwitching / 1000} kHz` },
        { label: 'Temps mort (Dead-time)', value: '100 ns', note: 'Prévention court-circuit HS/LS' },
        { label: 'Résistance de grille (Rg)', value: '22 Ω', note: 'Contrôle EMI' },
        { label: 'Condensateur bootstrap', value: '100 nF', note: 'Alimentation grille MOSFET haut côté' },
      ]
    },
    {
      stageName: '2. Pont en H (Commutation)',
      components: [
        { label: 'MOSFET N-Ch (Q1, Q3)', value: 'IRFZ44N / STP80NF55', note: `Vds > ${(vcc * 1.5).toFixed(0)} V, Id > ${(iPeak * 1.5).toFixed(1)} A` },
        { label: 'MOSFET N-Ch (Q2, Q4)', value: 'IRFZ44N / STP80NF55', note: 'Symétrique' },
        { label: 'Diodes de roue libre', value: 'Body diode MOSFET', note: 'ou Schottky ext.' },
        { label: 'Shunt courant (Rs)', value: `${rShunt} Ω / 1 W`, note: 'Mesure courant' },
      ]
    },
    {
      stageName: '3. Filtre LC de Sortie',
      components: [
        { label: 'Inductance de filtre (L)', value: `${lFilterUH} µH`, note: `fc = ${fc / 1000} kHz` },
        { label: 'Condensateur de filtre (C)', value: `${cFilterUF} µF`, note: 'Film polypropylène' },
        { label: "Réseau d'amortissement", value: `${(p.loadImpedance / 2).toFixed(1)} Ω + ${(cFilterUF / 2).toFixed(1)} µF`, note: 'Damping LC' },
        { label: 'Inductance de mode commun', value: '10–100 µH', note: 'Réduction EMI' },
      ]
    },
    {
      stageName: '4. Alimentation & Découplage',
      components: [
        { label: 'Condensateur de bus', value: `${cBulk} µF / ${Math.ceil(vcc * 1.3)} V`, note: 'Électrolytique basse ESR' },
        { label: 'Condensateur de découplage', value: '10 µF + 100 nF', note: 'Par MOSFET' },
        { label: 'Fusible de bus', value: `${(iPeak * 1.5).toFixed(1)} A rapide`, note: 'Protection' },
        { label: 'TVS', value: `${Math.ceil(vcc * 1.3)} V`, note: 'Protection surtensions' },
      ]
    }
  ];

  if (p.targetPower > realPower * 1.05) {
    warnings.push(`Puissance demandée (${p.targetPower} W) > max (${realPower.toFixed(1)} W) avec Vbus = ${vcc} V.`);
    suggestions.push(`Augmentez Vbus à ≥ ${Math.ceil(Math.sqrt(p.targetPower * p.loadImpedance) * Math.sqrt(2))} V.`);
  }
  if (vcc < 10) {
    warnings.push('Tension de bus trop faible pour Classe D (< 10 V).');
    suggestions.push('Minimum 12 V de bus.');
  }
  if (lFilterUH < 2) {
    warnings.push(`Inductance de filtre faible (${lFilterUH} µH) — instabilité possible.`);
    suggestions.push('Augmentez L à ≥ 10 µH.');
  }
  if (p.loadImpedance < 4) {
    warnings.push(`Charge ${p.loadImpedance} Ω : courant élevé (${iPeak.toFixed(1)} A) — EMI sévères.`);
    suggestions.push('MOSFETs Rds(on) < 10 mΩ requis.');
  }

  const verdict: 'Functional' | 'Risk' | 'Failed' =
    warnings.length === 0 ? 'Functional' : warnings.length <= 2 ? 'Risk' : 'Failed';

  return {
    vcc, vPeak: parseFloat(vPeak.toFixed(2)), iPeak: parseFloat(iPeak.toFixed(2)),
    iQuiescent, realPower: parseFloat(realPower.toFixed(1)), efficiency,
    pdTotal: parseFloat(pdTotal.toFixed(2)), pdPerDevice: parseFloat(pdPerDevice.toFixed(2)),
    rthRequired: parseFloat(rthRequired.toFixed(2)), tjMax, heatsinkArea: parseFloat(heatsinkArea.toFixed(0)),
    stages, recommendation: { verdict, warnings, suggestions },
    blockDiagram: ['IN', 'PWM Mod.', 'Gate Drive', 'H-Bridge', 'Filtre LC', 'LOAD']
  };
}

export function calculateAmplifier(params: UserParams): CalculationResults {
  if (params.ampClass === 'Class D') return calculateClassD(params);
  return calculateClassAB(params);
}
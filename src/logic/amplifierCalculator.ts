
export type AmplifierClass = 'Class AB' | 'Class D';
export type SupplyType = 'Simple' | 'Symmetrical';

export interface UserParams {
  targetPower: number; // Watts
  loadImpedance: number; // Ohms
  supplyVoltage: number; // Volts (Total or Vcc)
  supplyType: SupplyType;
  ampClass: AmplifierClass;
  ambientTemp: number; // °C
}

export type Analysis = {
  id: string;
  date: string;
  power: number;
  impedance: number;
  vcc: number;
  architecture: string;
  verdict: string;
};

export interface Recommendation {
  architecture: string;
  components: string[];
  heatsinkType: string;
  warnings: string[];
  whyRecommended: string;
  classDSpecifics?: {
    module: string;
    switchingFreq: string;
    filterType: string;
    recommendedVoltage: string;
  };
}

export interface BOMItem {
  name: string;
  quantity: number;
  description: string;
}

export interface ComparisonPoint {
  ampClass: AmplifierClass;
  efficiency: number;
  dissipation: number;
  complexity: 'Basse' | 'Moyenne' | 'Haute';
  cost: 'Bas' | 'Moyen' | 'Élevé';
  isViable: boolean;
  score: number;
}

export interface CalculationResults {
  vRms: number;
  vPeak: number;
  iRms: number;
  iPeak: number;
  maxTheoreticalPower: number;
  efficiency: number;
  dissipatedPower: number;
  heatsinkResistanceRequired: number;
  thd: number;
  tj: number;
  verdict: 'Functional' | 'At Risk' | 'Non-functional';
  reasons: string[];
  recommendation: Recommendation;
  bom: BOMItem[];
  comparison: {
    points: ComparisonPoint[];
    bestClass: AmplifierClass | null;
  };
  powerSupply: {
    voltageSymmetrical: string;
    voltageSimple: string;
    minCurrent: string;
  };
}

const validateConfig = (params: UserParams, targetPower: number, loadImpedance: number, railVoltage: number, vPeak: number, ampClass: AmplifierClass, maxTheoreticalPower: number): { efficiency: number; dissipatedPower: number; heatsinkResistanceRequired: number; isViable: boolean } => {
  let efficiency = 0;
  if (ampClass === 'Class AB') {
    const theoreticalEta = (Math.PI / 4) * (vPeak / railVoltage);
    efficiency = Math.min(0.7, theoreticalEta * 0.85);
    if (efficiency < 0.2) efficiency = 0.2;
  } else {
    efficiency = 0.90;
  }
  const dissipatedPower = targetPower * (1 - efficiency);
  
  const tjSafety = 95;
  const rthJc = 1.0;
  const rthCs = 0.5;
  const rthTotalAllowed = (tjSafety - params.ambientTemp) / Math.max(0.5, dissipatedPower);
  const heatsinkResistanceRequired = rthTotalAllowed - rthJc - rthCs;

  const isViable = targetPower <= maxTheoreticalPower && (heatsinkResistanceRequired >= 0.3 || dissipatedPower < 20);
  
  return { efficiency, dissipatedPower, heatsinkResistanceRequired, isViable };
};

export const calculateAmplifier = (params: UserParams): CalculationResults => {
  const { targetPower, loadImpedance, supplyVoltage, supplyType, ampClass, ambientTemp } = params;

  let railVoltage = 0;
  if (supplyType === 'Symmetrical') {
    railVoltage = supplyVoltage;
  } else {
    railVoltage = supplyVoltage / 2;
  }
  
  const vRms = Math.sqrt(targetPower * loadImpedance);
  const vPeak = vRms * Math.sqrt(2);
  const iRms = vRms / loadImpedance;
  const iPeak = vPeak / loadImpedance;

  const classes: AmplifierClass[] = ['Class AB', 'Class D'];
  const comparisonPoints: ComparisonPoint[] = classes.map(cls => {
    const vDrop = cls === 'Class AB' ? 3.5 : 0.8; 
    const vPeakMax = railVoltage - vDrop;
    const maxTheo = Math.pow(Math.max(0, vPeakMax), 2) / (2 * loadImpedance);
    
    const m = validateConfig(params, targetPower, loadImpedance, railVoltage, vPeak, cls, maxTheo);
    
    const complexity: 'Basse' | 'Moyenne' | 'Haute' = cls === 'Class AB' ? (targetPower < 60 ? 'Basse' : 'Moyenne') : 'Haute';
    const cost: 'Bas' | 'Moyen' | 'Élevé' = cls === 'Class AB' ? (targetPower > 100 ? 'Élevé' : 'Moyen') : 'Moyen';
    
    // Scoring: only viable configs get a positive score
    let score = -1;
    if (m.isViable) {
      score = (1 - m.dissipatedPower / 300) * 0.5; // Base score on dissipation
      
      // User thresholds
      if (cls === 'Class D') {
        if (targetPower > 30) score += 0.4; // Strong preference for D > 30W
        if (m.dissipatedPower < 10) score += 0.2;
      } else if (cls === 'Class AB') {
        if (m.dissipatedPower > 25) score -= 0.3; // Penalty for AB if hot
        if (targetPower < 20) score += 0.3; // Preference for AB at very low power (fidelity)
      }

      if (complexity === 'Basse') score += 0.2;
    }

    return {
      ampClass: cls,
      efficiency: m.efficiency,
      dissipation: m.dissipatedPower,
      complexity,
      cost,
      isViable: m.isViable,
      score
    };
  });

  const getBestArchitecture = (points: ComparisonPoint[]): AmplifierClass | null => {
    const best = points.reduce((prev, curr) => prev.score > curr.score ? prev : curr);
    return best.score > -1 ? best.ampClass : null;
  };

  const bestClass = getBestArchitecture(comparisonPoints);
  const targetClass = bestClass || ampClass;

  const vDropCur = targetClass === 'Class AB' ? 3.5 : 0.8;
  const vPeakMaxCur = railVoltage - vDropCur;
  const maxTheoCur = Math.pow(Math.max(0, vPeakMaxCur), 2) / (2 * loadImpedance);
  const curMetrics = validateConfig(params, targetPower, loadImpedance, railVoltage, vPeak, targetClass, maxTheoCur);

  const reasons: string[] = [];
  let verdict: 'Functional' | 'At Risk' | 'Non-functional' = 'Functional';

  if (targetPower > maxTheoCur) {
    verdict = 'Non-functional';
    reasons.push(`Clipping sévère : Tension disponible (${vPeakMaxCur.toFixed(1)}V) < Nécessaire (${vPeak.toFixed(1)}V).`);
  } else if (targetPower > maxTheoCur * 0.85) {
    if (verdict !== 'Non-functional') verdict = 'At Risk';
    reasons.push('Marge de tension faible (saturation probable).');
  }

  if (iPeak > 15) {
    if (verdict === 'Functional') verdict = 'At Risk';
    reasons.push(`Courant excessif (${iPeak.toFixed(1)}A).`);
  }

  if (curMetrics.dissipatedPower > 0) {
    const tempRise = curMetrics.tj - ambientTemp;
    if (tempRise > 90) {
      verdict = 'Non-functional';
      reasons.push(`Surchauffe critique (Rise: ${tempRise.toFixed(0)}°C).`);
    } else if (tempRise > 60) {
      if (verdict !== 'Non-functional') verdict = 'At Risk';
      reasons.push(`Marge de sécurité thermique (60%) dépassée.`);
    }
  }

  if (curMetrics.heatsinkResistanceRequired < 0.3 && curMetrics.dissipatedPower > 20) {
    verdict = 'Non-functional';
    reasons.push('Thermique impossible (solution passive irréaliste).');
  }

  // 5. Recommendations & BOM
  const recommendation: Recommendation = { architecture: '', components: [], heatsinkType: '', warnings: [], whyRecommended: '' };
  const isThermalFailure = verdict === 'Non-functional' && (reasons.some(r => r.includes('Thermique') || r.includes('Chaleur')) || curMetrics.heatsinkResistanceRequired < 0.3);

  const bom: BOMItem[] = [];

  if (targetClass === 'Class D') {
    const classDOptions = [
      { name: "TPA3116D2", maxVoltage: 30, maxPower: 50, maxCurrent: 7.5, freq: "400 kHz" },
      { name: "IRS2092S", maxVoltage: 100, maxPower: 200, maxCurrent: 20.0, freq: "350 - 450 kHz" }
    ];

    const selected = classDOptions.find(c => 
      supplyVoltage <= c.maxVoltage && 
      targetPower <= c.maxPower &&
      iPeak <= c.maxCurrent * 0.75 // Marge de sécurité courant 75%
    );
    const moduleName = selected ? selected.name : "IRS2092S (MOSFETs Externes)";
    const freq = selected ? selected.freq : "300 kHz";

    if (!selected) {
      const tooMuchCurrent = classDOptions.every(c => iPeak > c.maxCurrent * 0.75);
      if (tooMuchCurrent) {
        verdict = 'Non-functional';
        reasons.push(`Courant de crête (${iPeak.toFixed(1)}A) dépassant la marge de sécurité (75%).`);
      }
      recommendation.warnings.push("Marge de sécurité courant non respectée sur IC standards.");
    }

    recommendation.architecture = `Classe D (${moduleName})`;
    recommendation.classDSpecifics = {
      module: moduleName,
      switchingFreq: freq,
      filterType: "LC Passe-bas (L=22µH, C=470nF)",
      recommendedVoltage: targetPower < 60 ? "24V (Simple)" : "±35V à ±50V (Symétrique)"
    };
    recommendation.components = [moduleName, "Inducteurs de sortie blindés", "Condensateurs Low-ESR"];
    recommendation.heatsinkType = curMetrics.dissipatedPower > 15 ? "Petit dissipateur alu" : "Via plan de cuivre PCB";
    
    if (isThermalFailure) {
      recommendation.whyRecommended = `Architecture Classe AB impossible thermiquement dans cette configuration. Le passage en Classe D réduit la dissipation à environ ${curMetrics.dissipatedPower.toFixed(0)}W.`;
    } else if (moduleName === "TPA3116D2") {
      recommendation.whyRecommended = "Le TPA3116D2 est recommandé pour son rendement élevé, sa facilité d'utilisation et son adéquation aux puissances < 60W.";
    } else {
      recommendation.whyRecommended = `Le module ${moduleName} est choisi pour son excellent rendement et sa gestion thermique optimale à ${targetPower}W.`;
    }

    // BOM for Class D
    bom.push({ name: "Connecteur Jack Audio", quantity: 1, description: "Entrée signal (Jack 3.5mm)" });
    bom.push({ name: "Filtre Entrée RC", quantity: 1, description: "10kΩ + 100nF (Couplage)" });
    bom.push({ name: `IC ${moduleName}`, quantity: 1, description: "Unité de puissance principale" });
    bom.push({ name: "Filtre Sortie LC", quantity: 2, description: "22µH + 470nF (Passe-bas)" });
    bom.push({ name: "Condensateurs Découplage", quantity: 2, description: "1000µF + 100nF (Stabilité)" });
    bom.push({ name: "Bornier HP", quantity: 1, description: "Sortie vers Speaker 8Ω" });
    
    if (curMetrics.dissipatedPower > 15) {
      bom.push({ name: "Radiateur", quantity: 1, description: "Dissipateur alu requis" });
    }
  } else {
    recommendation.architecture = "Classe AB (Linéaire)";
    recommendation.components = targetPower < 60 ? ["LM3886", "TDA7293"] : ["2SC5200/2SA1943"];
    recommendation.heatsinkType = "Massif";
    recommendation.whyRecommended = "Excellente fidélité à puissance modérée.";
    
    // BOM for Class AB
    if (targetPower < 60) {
      bom.push({ name: "IC Amplificateur", quantity: 1, description: "LM3886 / TDA7293" });
    } else {
      bom.push({ name: "Paire de Puissance", quantity: Math.max(1, Math.ceil(targetPower / 80)), description: "2SC5200 + 2SA1943" });
    }
    
    const capValue = Math.ceil((iRms * 3000) / 1000) * 1000;
    bom.push({ name: "Capacité Filtrage", quantity: supplyType === 'Symmetrical' ? 2 : 1, description: `${capValue}uF / ${Math.ceil(supplyVoltage * 1.4)}V` });
    
    if (curMetrics.heatsinkResistanceRequired < 10) {
      bom.push({ name: "Dissipateur Massif", quantity: 1, description: `${curMetrics.heatsinkResistanceRequired.toFixed(1)} °C/W ou mieux` });
    }
  }

  const powerSupply = {
    voltageSymmetrical: `±${Math.ceil(vPeak + (targetClass === 'Class AB' ? 5 : 3))}V`,
    voltageSimple: `${Math.ceil((vPeak + (targetClass === 'Class AB' ? 5 : 3)) * 2)}V`,
    minCurrent: `${(iRms * 1.5).toFixed(1)}A`
  };

  const thd = targetClass === 'Class D' ? 0.1 : 0.5;
  const tj = ambientTemp + curMetrics.dissipatedPower * (1.0 + (curMetrics.heatsinkResistanceRequired > 0 ? curMetrics.heatsinkResistanceRequired : 5.0));

  return {
    vRms,
    vPeak,
    iRms,
    iPeak,
    maxTheoreticalPower: maxTheoCur,
    dissipatedPower: curMetrics.dissipatedPower,
    efficiency: curMetrics.efficiency,
    heatsinkResistanceRequired: curMetrics.heatsinkResistanceRequired,
    thd,
    tj,
    verdict,
    reasons,
    comparison: {
      points: comparisonPoints,
      bestClass
    },
    recommendation,
    bom,
    powerSupply
  };
};

import type { AmplifierClass, SupplyType } from './amplifierCalculator';

export interface CircuitInput {
    targetPower: number;
    loadImpedance: number;
    supplyVoltage: number;
    supplyType: SupplyType;
    ampClass: AmplifierClass;
    ambientTemp: number;
}

export interface CircuitComponent {
    ref: string;
    name: string;
    value: string;
    quantity: number;
    rating: string;
    role: string;
    notes?: string;
}

export interface CircuitBlock {
    id: string;
    label: string;
    description: string;
}

export interface GeneratedCircuit {
    architecture: string;
    mainIC: string;
    schematicText: string[];
    blocks: CircuitBlock[];
    bom: CircuitComponent[];
    warnings: string[];
    recommendations: string[];
}

const round = (value: number, digits = 2): number => {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
};

const chooseOutputInductor = (loadImpedance: number, targetPower: number): string => {
    if (loadImpedance <= 2) return targetPower > 100 ? '10 µH' : '15 µH';
    if (loadImpedance <= 4) return targetPower > 100 ? '15 µH' : '22 µH';
    if (loadImpedance <= 8) return targetPower > 100 ? '22 µH' : '33 µH';
    return '47 µH';
};

const chooseOutputCapacitor = (loadImpedance: number): string => {
    if (loadImpedance <= 2) return '1 µF';
    if (loadImpedance <= 4) return '680 nF';
    if (loadImpedance <= 8) return '470 nF';
    return '220 nF';
};

const chooseVoltageRating = (supplyVoltage: number): string => {
    const required = Math.ceil(supplyVoltage * 1.8);
    if (required <= 50) return '50 V';
    if (required <= 80) return '80 V';
    if (required <= 100) return '100 V';
    if (required <= 160) return '160 V';
    return '200 V';
};

const chooseMosfetRating = (supplyVoltage: number, peakCurrent: number): string => {
    const voltage = supplyVoltage <= 35 ? '80 V' : supplyVoltage <= 50 ? '100 V' : '150 V';
    const current = peakCurrent < 10 ? '30 A' : peakCurrent < 20 ? '50 A' : '80 A';
    return `${voltage} / ${current}`;
};

const generateClassD = (input: CircuitInput): GeneratedCircuit => {
    const {
        targetPower,
        loadImpedance,
        supplyVoltage,
        supplyType,
    } = input;

    const vRms = Math.sqrt(targetPower * loadImpedance);
    const vPeak = vRms * Math.SQRT2;
    const iRms = vRms / loadImpedance;
    const iPeak = iRms * Math.SQRT2;

    const voltageRating = chooseVoltageRating(supplyVoltage);
    const inductor = chooseOutputInductor(loadImpedance, targetPower);
    const outputCap = chooseOutputCapacitor(loadImpedance);
    const mosfetRating = chooseMosfetRating(supplyVoltage, iPeak);

    const mainIC = targetPower <= 100 ? 'IRS2092S' : 'IRS20957S';

    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (supplyType === 'Symmetrical') {
        recommendations.push('Une alimentation simple est généralement plus adaptée à une architecture Classe D.');
    }

    if (iPeak > 15) {
        warnings.push('Courant crête élevé : prévoir pistes PCB larges, plan de masse solide et bornier HP adapté.');
    }

    if (supplyVoltage < vPeak * 1.15) {
        warnings.push('Tension d’alimentation proche de la limite : risque de clipping à pleine puissance.');
    }

    recommendations.push('Utiliser un PCB avec plan de masse continu et découplage très proche des MOSFETs.');
    recommendations.push('Placer le filtre LC de sortie près de l’étage de puissance.');
    recommendations.push('Prévoir tests EMI/parasites avant usage réel.');

    const bom: CircuitComponent[] = [
        {
            ref: 'J1',
            name: 'Connecteur entrée audio',
            value: 'Jack 3.5 mm ou RCA',
            quantity: 1,
            rating: 'Signal audio',
            role: 'Entrée audio',
        },
        {
            ref: 'C1',
            name: 'Condensateur de liaison entrée',
            value: '100 nF',
            quantity: 1,
            rating: 'Film / 50 V minimum',
            role: 'Bloque le continu en entrée',
        },
        {
            ref: 'R1',
            name: 'Résistance entrée',
            value: '10 kΩ',
            quantity: 1,
            rating: '1/4 W, 1%',
            role: 'Impédance d’entrée',
        },
        {
            ref: 'U1',
            name: 'Contrôleur Classe D',
            value: mainIC,
            quantity: 1,
            rating: voltageRating,
            role: 'Contrôle PWM et driver',
        },
        {
            ref: 'Q1-Q2',
            name: 'MOSFETs puissance',
            value: 'N-MOSFET faible Rds(on)',
            quantity: 2,
            rating: mosfetRating,
            role: 'Demi-pont de puissance',
        },
        {
            ref: 'Rg1-Rg2',
            name: 'Résistances de grille',
            value: '10 Ω',
            quantity: 2,
            rating: '1/4 W',
            role: 'Limitation oscillations gate',
        },
        {
            ref: 'L1',
            name: 'Inductance filtre sortie',
            value: inductor,
            quantity: 1,
            rating: `${round(iPeak * 1.4, 1)} A minimum`,
            role: 'Filtre passe-bas de sortie',
        },
        {
            ref: 'Cout1',
            name: 'Condensateur filtre sortie',
            value: outputCap,
            quantity: 1,
            rating: `Film ${voltageRating}`,
            role: 'Filtre LC de sortie',
        },
        {
            ref: 'Cbulk1-Cbulk2',
            name: 'Condensateurs réservoir alimentation',
            value: '1000 µF',
            quantity: 2,
            rating: voltageRating,
            role: 'Réserve d’énergie alimentation',
        },
        {
            ref: 'Cdec1-Cdec4',
            name: 'Condensateurs découplage',
            value: '100 nF',
            quantity: 4,
            rating: voltageRating,
            role: 'Découplage haute fréquence',
        },
        {
            ref: 'D1',
            name: 'Diode protection inversion',
            value: 'Schottky',
            quantity: 1,
            rating: `${voltageRating}, ${round(iPeak, 1)} A`,
            role: 'Protection alimentation',
        },
        {
            ref: 'J2',
            name: 'Bornier haut-parleur',
            value: `${loadImpedance} Ω`,
            quantity: 1,
            rating: `${round(iPeak, 1)} A minimum`,
            role: 'Sortie vers haut-parleur',
        },
    ];

    return {
        architecture: 'Classe D',
        mainIC,
        schematicText: [
            '[Entrée Audio]',
            '   ↓',
            'C1 100nF + R1 10kΩ',
            '   ↓',
            `[${mainIC}]`,
            '   ↓ PWM',
            '[MOSFET Demi-Pont Q1/Q2]',
            '   ↓',
            `[Filtre LC : L1 ${inductor} + Cout ${outputCap}]`,
            '   ↓',
            `[Haut-parleur ${loadImpedance}Ω]`,
        ],
        blocks: [
            {
                id: 'input',
                label: 'Entrée audio',
                description: 'Connecteur audio avec filtrage RC d’entrée.',
            },
            {
                id: 'controller',
                label: mainIC,
                description: 'Contrôleur Classe D générant le signal PWM.',
            },
            {
                id: 'power-stage',
                label: 'Étage MOSFET',
                description: 'Demi-pont de puissance pour fournir le courant au haut-parleur.',
            },
            {
                id: 'output-filter',
                label: 'Filtre LC',
                description: `Filtre de sortie ${inductor} + ${outputCap}.`,
            },
            {
                id: 'speaker',
                label: 'Haut-parleur',
                description: `Charge audio ${loadImpedance}Ω.`,
            },
        ],
        bom,
        warnings,
        recommendations,
    };
};

const generateClassAB = (input: CircuitInput): GeneratedCircuit => {
    const {
        targetPower,
        loadImpedance,
        supplyVoltage,
        supplyType,
    } = input;

    const vRms = Math.sqrt(targetPower * loadImpedance);
    const vPeak = vRms * Math.SQRT2;
    const iRms = vRms / loadImpedance;
    const iPeak = iRms * Math.SQRT2;

    const voltageRating = chooseVoltageRating(supplyVoltage);
    const mainIC = targetPower <= 30 ? 'TDA7294' : targetPower <= 80 ? 'LM3886 / TDA7294' : 'Étage discret MOSFET/BJT';

    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (supplyType === 'Simple') {
        warnings.push('Une alimentation simple est moins adaptée à la Classe AB haute puissance. Préférer une alimentation symétrique.');
    }

    if (targetPower > 80) {
        warnings.push('Classe AB au-delà de 80 W : forte dissipation thermique, gros dissipateur obligatoire.');
    }

    if (supplyVoltage < vPeak * 1.25) {
        warnings.push('Tension d’alimentation faible : risque de saturation et distorsion à pleine puissance.');
    }

    recommendations.push('Prévoir un dissipateur thermique dimensionné avec marge.');
    recommendations.push('Utiliser une alimentation symétrique stable avec bons condensateurs réservoir.');
    recommendations.push('Ajouter protection haut-parleur et temporisation anti-pop.');

    const feedbackR2 = targetPower <= 50 ? '22 kΩ' : '33 kΩ';

    const bom: CircuitComponent[] = [
        {
            ref: 'J1',
            name: 'Connecteur entrée audio',
            value: 'Jack 3.5 mm ou RCA',
            quantity: 1,
            rating: 'Signal audio',
            role: 'Entrée audio',
        },
        {
            ref: 'C1',
            name: 'Condensateur entrée',
            value: '1 µF',
            quantity: 1,
            rating: 'Film / 50 V',
            role: 'Couplage audio entrée',
        },
        {
            ref: 'R1',
            name: 'Résistance entrée',
            value: '22 kΩ',
            quantity: 1,
            rating: '1/4 W, 1%',
            role: 'Impédance d’entrée',
        },
        {
            ref: 'U1',
            name: 'Amplificateur Classe AB',
            value: mainIC,
            quantity: 1,
            rating: voltageRating,
            role: 'Étape amplification principale',
        },
        {
            ref: 'Rfb1',
            name: 'Résistance feedback bas',
            value: '1 kΩ',
            quantity: 1,
            rating: '1/4 W, 1%',
            role: 'Définition du gain',
        },
        {
            ref: 'Rfb2',
            name: 'Résistance feedback haut',
            value: feedbackR2,
            quantity: 1,
            rating: '1/4 W, 1%',
            role: 'Définition du gain',
        },
        {
            ref: 'Cfb1',
            name: 'Condensateur compensation',
            value: '22 pF',
            quantity: 1,
            rating: 'Céramique / 50 V',
            role: 'Stabilité haute fréquence',
        },
        {
            ref: 'Rs1',
            name: 'Résistance sortie série',
            value: '0.22 Ω',
            quantity: 2,
            rating: '5 W',
            role: 'Équilibrage courant sortie',
        },
        {
            ref: 'Cbulk1-Cbulk2',
            name: 'Condensateurs réservoir alimentation',
            value: '4700 µF',
            quantity: 2,
            rating: voltageRating,
            role: 'Filtrage alimentation',
        },
        {
            ref: 'Cdec1-Cdec4',
            name: 'Condensateurs découplage',
            value: '100 nF',
            quantity: 4,
            rating: voltageRating,
            role: 'Découplage local',
        },
        {
            ref: 'HS1',
            name: 'Dissipateur thermique',
            value: targetPower <= 50 ? '≤ 2 °C/W' : '≤ 1 °C/W',
            quantity: 1,
            rating: 'Avec pâte thermique',
            role: 'Refroidissement ampli',
        },
        {
            ref: 'J2',
            name: 'Bornier haut-parleur',
            value: `${loadImpedance} Ω`,
            quantity: 1,
            rating: `${round(iPeak, 1)} A minimum`,
            role: 'Sortie vers haut-parleur',
        },
    ];

    return {
        architecture: 'Classe AB',
        mainIC,
        schematicText: [
            '[Entrée Audio]',
            '   ↓',
            'C1 1µF + R1 22kΩ',
            '   ↓',
            `[${mainIC}]`,
            '   ↓',
            '[Réseau feedback Rfb1/Rfb2]',
            '   ↓',
            `[Sortie vers haut-parleur ${loadImpedance}Ω]`,
            '   ↓',
            '[Dissipateur thermique obligatoire]',
        ],
        blocks: [
            {
                id: 'input',
                label: 'Entrée audio',
                description: 'Entrée avec condensateur de liaison et résistance d’entrée.',
            },
            {
                id: 'amplifier',
                label: mainIC,
                description: 'Amplificateur linéaire Classe AB.',
            },
            {
                id: 'feedback',
                label: 'Feedback',
                description: `Réseau de gain avec Rfb1 1kΩ et Rfb2 ${feedbackR2}.`,
            },
            {
                id: 'thermal',
                label: 'Dissipateur',
                description: 'Évacuation thermique indispensable pour Classe AB.',
            },
            {
                id: 'speaker',
                label: 'Haut-parleur',
                description: `Charge audio ${loadImpedance}Ω.`,
            },
        ],
        bom,
        warnings,
        recommendations,
    };
};

export const generateCircuit = (input: CircuitInput): GeneratedCircuit => {
    if (input.ampClass === 'Class D') {
        return generateClassD(input);
    }

    return generateClassAB(input);
};
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
    if (targetPower <= 25) return loadImpedance <= 4 ? '22 µH' : '33 µH';
    if (targetPower <= 60) return loadImpedance <= 4 ? '15 µH' : '22 µH';
    return loadImpedance <= 4 ? '10 µH' : '15 µH';
};

const chooseOutputCapacitor = (loadImpedance: number, targetPower: number): string => {
    if (targetPower <= 25) return loadImpedance <= 4 ? '680 nF' : '470 nF';
    if (targetPower <= 60) return loadImpedance <= 4 ? '820 nF' : '680 nF';
    return loadImpedance <= 4 ? '1 µF' : '820 nF';
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

const getPowerLevel = (targetPower: number): 'LOW' | 'MID' | 'HIGH' => {
    if (targetPower <= 25) return 'LOW';
    if (targetPower <= 60) return 'MID';
    return 'HIGH';
};

const generateClassD = (input: CircuitInput): GeneratedCircuit => {
    const { targetPower, loadImpedance, supplyVoltage, supplyType } = input;

    const vRms = Math.sqrt(targetPower * loadImpedance);
    const vPeak = vRms * Math.SQRT2;
    const iRms = vRms / loadImpedance;
    const iPeak = iRms * Math.SQRT2;

    const powerLevel = getPowerLevel(targetPower);
    const voltageRating = chooseVoltageRating(supplyVoltage);
    const inductor = chooseOutputInductor(loadImpedance, targetPower);
    const outputCap = chooseOutputCapacitor(loadImpedance, targetPower);
    const mosfetRating = chooseMosfetRating(supplyVoltage, iPeak);

    const configs = {
        LOW: {
            ic: 'TPA3116D2',
            mosfet: 'MOSFET intégrés dans le TPA3116D2',
            mosfetQty: 0,
            gateResQty: 0,
            bulkCap: '1000 µF',
            inputCap: '100 nF',
            inputRes: '10 kΩ',
            notes: 'Solution intégrée adaptée aux petites puissances.',
        },
        MID: {
            ic: 'TPA3116D2',
            mosfet: 'MOSFET intégrés dans le TPA3116D2',
            mosfetQty: 0,
            gateResQty: 0,
            bulkCap: '2200 µF',
            inputCap: '220 nF',
            inputRes: '10 kΩ',
            notes: 'Version renforcée : alimentation et condensateurs plus robustes.',
        },
        HIGH: {
            ic: 'IRS2092S',
            mosfet: 'N-MOSFET externes faible Rds(on)',
            mosfetQty: 2,
            gateResQty: 2,
            bulkCap: '4700 µF',
            inputCap: '220 nF',
            inputRes: '22 kΩ',
            notes: 'Architecture discrète avec driver + MOSFET externes.',
        },
    };

    const cfg = configs[powerLevel];
    const mainIC = cfg.ic;

    const warnings: string[] = [];
    const recommendations: string[] = [cfg.notes];

    if (supplyType === 'Symmetrical') {
        recommendations.push('Une alimentation simple est généralement plus adaptée à une architecture Classe D.');
    }

    if (iPeak > 15) {
        warnings.push('Courant crête élevé : prévoir pistes PCB larges, plan de masse solide et bornier HP adapté.');
    }

    if (supplyVoltage < vPeak * 1.15) {
        warnings.push('Tension d’alimentation proche de la limite : risque de clipping à pleine puissance.');
    }

    recommendations.push('Utiliser un PCB avec plan de masse continu et découplage très proche de l’étage de puissance.');
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
            value: cfg.inputCap,
            quantity: 1,
            rating: 'Film / 50 V minimum',
            role: 'Bloque le continu en entrée',
        },
        {
            ref: 'R1',
            name: 'Résistance entrée',
            value: cfg.inputRes,
            quantity: 1,
            rating: '1/4 W, 1%',
            role: 'Impédance d’entrée',
        },
        {
            ref: 'U1',
            name: powerLevel === 'HIGH' ? 'Contrôleur Classe D' : 'Amplificateur Classe D intégré',
            value: mainIC,
            quantity: 1,
            rating: voltageRating,
            role: powerLevel === 'HIGH' ? 'Contrôle PWM et driver' : 'Amplification Classe D intégrée',
        },
        {
            ref: 'Q1-Q2',
            name: 'MOSFETs puissance',
            value: cfg.mosfet,
            quantity: cfg.mosfetQty,
            rating: cfg.mosfetQty > 0 ? mosfetRating : 'Intégré',
            role: cfg.mosfetQty > 0 ? 'Demi-pont de puissance' : 'Inclus dans l’IC',
        },
        {
            ref: 'Rg1-Rg2',
            name: 'Résistances de grille',
            value: cfg.gateResQty > 0 ? '10 Ω' : 'Non requis',
            quantity: cfg.gateResQty,
            rating: cfg.gateResQty > 0 ? '1/4 W' : 'Intégré',
            role: cfg.gateResQty > 0 ? 'Limitation oscillations gate' : 'Non requis avec IC intégré',
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
            value: cfg.bulkCap,
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
            `C1 ${cfg.inputCap} + R1 ${cfg.inputRes}`,
            '   ↓',
            `[${mainIC}]`,
            powerLevel === 'HIGH' ? '   ↓ PWM' : '   ↓ Sortie Classe D intégrée',
            powerLevel === 'HIGH' ? '[MOSFET Demi-Pont Q1/Q2]' : '[Étage puissance intégré]',
            '   ↓',
            `[Filtre LC : L1 ${inductor} + Cout ${outputCap}]`,
            '   ↓',
            `[Haut-parleur ${loadImpedance}Ω]`,
        ],
        blocks: [
            { id: 'input', label: 'Entrée audio', description: 'Connecteur audio avec filtrage RC d’entrée.' },
            { id: 'controller', label: mainIC, description: cfg.notes },
            {
                id: 'power-stage',
                label: powerLevel === 'HIGH' ? 'Étage MOSFET externe' : 'Étage intégré',
                description: cfg.mosfet,
            },
            { id: 'output-filter', label: 'Filtre LC', description: `Filtre de sortie ${inductor} + ${outputCap}.` },
            { id: 'speaker', label: 'Haut-parleur', description: `Charge audio ${loadImpedance}Ω.` },
        ],
        bom,
        warnings,
        recommendations,
    };
};

const generateClassAB = (input: CircuitInput): GeneratedCircuit => {
    const { targetPower, loadImpedance, supplyVoltage, supplyType } = input;

    const vRms = Math.sqrt(targetPower * loadImpedance);
    const vPeak = vRms * Math.SQRT2;
    const iRms = vRms / loadImpedance;
    const iPeak = iRms * Math.SQRT2;

    const voltageRating = chooseVoltageRating(supplyVoltage);
    const mainIC = targetPower <= 30 ? 'TDA7294' : targetPower <= 80 ? 'LM3886 / TDA7294' : 'Étage discret MOSFET/BJT';
    const feedbackR2 = targetPower <= 50 ? '22 kΩ' : '33 kΩ';
    const bulkCap = targetPower <= 30 ? '2200 µF' : targetPower <= 80 ? '4700 µF' : '6800 µF';

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

    const bom: CircuitComponent[] = [
        { ref: 'J1', name: 'Connecteur entrée audio', value: 'Jack 3.5 mm ou RCA', quantity: 1, rating: 'Signal audio', role: 'Entrée audio' },
        { ref: 'C1', name: 'Condensateur entrée', value: '1 µF', quantity: 1, rating: 'Film / 50 V', role: 'Couplage audio entrée' },
        { ref: 'R1', name: 'Résistance entrée', value: '22 kΩ', quantity: 1, rating: '1/4 W, 1%', role: 'Impédance d’entrée' },
        { ref: 'U1', name: 'Amplificateur Classe AB', value: mainIC, quantity: 1, rating: voltageRating, role: 'Étape amplification principale' },
        { ref: 'Rfb1', name: 'Résistance feedback bas', value: '1 kΩ', quantity: 1, rating: '1/4 W, 1%', role: 'Définition du gain' },
        { ref: 'Rfb2', name: 'Résistance feedback haut', value: feedbackR2, quantity: 1, rating: '1/4 W, 1%', role: 'Définition du gain' },
        { ref: 'Cfb1', name: 'Condensateur compensation', value: '22 pF', quantity: 1, rating: 'Céramique / 50 V', role: 'Stabilité haute fréquence' },
        { ref: 'Rs1', name: 'Résistance sortie série', value: '0.22 Ω', quantity: 2, rating: '5 W', role: 'Équilibrage courant sortie' },
        { ref: 'Cbulk1-Cbulk2', name: 'Condensateurs réservoir alimentation', value: bulkCap, quantity: 2, rating: voltageRating, role: 'Filtrage alimentation' },
        { ref: 'Cdec1-Cdec4', name: 'Condensateurs découplage', value: '100 nF', quantity: 4, rating: voltageRating, role: 'Découplage local' },
        { ref: 'HS1', name: 'Dissipateur thermique', value: targetPower <= 50 ? '≤ 2 °C/W' : '≤ 1 °C/W', quantity: 1, rating: 'Avec pâte thermique', role: 'Refroidissement ampli' },
        { ref: 'J2', name: 'Bornier haut-parleur', value: `${loadImpedance} Ω`, quantity: 1, rating: `${round(iPeak, 1)} A minimum`, role: 'Sortie vers haut-parleur' },
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
            { id: 'input', label: 'Entrée audio', description: 'Entrée avec condensateur de liaison et résistance d’entrée.' },
            { id: 'amplifier', label: mainIC, description: 'Amplificateur linéaire Classe AB.' },
            { id: 'feedback', label: 'Feedback', description: `Réseau de gain avec Rfb1 1kΩ et Rfb2 ${feedbackR2}.` },
            { id: 'thermal', label: 'Dissipateur', description: 'Évacuation thermique indispensable pour Classe AB.' },
            { id: 'speaker', label: 'Haut-parleur', description: `Charge audio ${loadImpedance}Ω.` },
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
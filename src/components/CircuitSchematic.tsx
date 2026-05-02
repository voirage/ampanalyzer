import React, { useMemo, useState } from 'react';
import type { GeneratedCircuit } from '../logic/circuitGenerator';

interface CircuitSchematicProps {
    circuit: GeneratedCircuit;
    ampClass: 'Class AB' | 'Class D';
}

const C = {
    bg: '#0d1117',
    panel: '#111827',
    wire: '#58a6ff',
    component: '#d1d5db',
    componentFill: '#1f2937',
    icFill: '#172554',
    icStroke: '#38bdf8',
    gnd: '#3fb950',
    power: '#f78166',
    highlight: '#ffa657',
    text: '#e5e7eb',
    muted: '#9ca3af',
};

interface Point {
    x: number;
    y: number;
}

interface SymbolProps {
    x: number;
    y: number;
    label: string;
    value?: string;
    highlighted?: boolean;
    vertical?: boolean;
    onClick?: () => void;
}

const Wire: React.FC<{ points: Point[]; highlighted?: boolean }> = ({ points, highlighted }) => {
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return (
        <path
            d={d}
            fill="none"
            stroke={highlighted ? C.highlight : C.wire}
            strokeWidth={highlighted ? 3 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    );
};

const Node: React.FC<Point> = ({ x, y }) => (
    <circle cx={x} cy={y} r={4} fill={C.gnd} stroke={C.bg} strokeWidth={1} />
);

const Resistor: React.FC<SymbolProps> = ({ x, y, label, value, highlighted, onClick }) => {
    const stroke = highlighted ? C.highlight : C.component;
    return (
        <g transform={`translate(${x}, ${y})`} onClick={onClick} style={{ cursor: 'pointer' }}>
            <line x1="0" y1="0" x2="14" y2="0" stroke={stroke} strokeWidth="2" />
            <rect x="14" y="-9" width="38" height="18" rx="3" fill={C.componentFill} stroke={stroke} strokeWidth="2" />
            <line x1="52" y1="0" x2="66" y2="0" stroke={stroke} strokeWidth="2" />
            <text x="33" y="-16" textAnchor="middle" fill={C.text} fontSize="11" fontWeight="bold">{label}</text>
            {value && <text x="33" y="25" textAnchor="middle" fill={C.muted} fontSize="10">{value}</text>}
        </g>
    );
};

const Capacitor: React.FC<SymbolProps> = ({ x, y, label, value, highlighted, vertical, onClick }) => {
    const stroke = highlighted ? C.highlight : C.component;
    const transform = vertical ? `translate(${x}, ${y}) rotate(90)` : `translate(${x}, ${y})`;
    return (
        <g transform={transform} onClick={onClick} style={{ cursor: 'pointer' }}>
            <line x1="0" y1="0" x2="18" y2="0" stroke={stroke} strokeWidth="2" />
            <line x1="22" y1="-12" x2="22" y2="12" stroke={stroke} strokeWidth="3" />
            <line x1="30" y1="-12" x2="30" y2="12" stroke={stroke} strokeWidth="3" />
            <line x1="34" y1="0" x2="52" y2="0" stroke={stroke} strokeWidth="2" />
            <text x="26" y="-18" textAnchor="middle" fill={C.text} fontSize="11" fontWeight="bold">{label}</text>
            {value && <text x="26" y="28" textAnchor="middle" fill={C.muted} fontSize="10">{value}</text>}
        </g>
    );
};

const Inductor: React.FC<SymbolProps> = ({ x, y, label, value, highlighted, onClick }) => {
    const stroke = highlighted ? C.highlight : C.component;
    const arcs = [0, 12, 24, 36]
        .map((dx) => `M ${dx} 0 a 6 6 0 0 1 12 0`)
        .join(' ');

    return (
        <g transform={`translate(${x}, ${y})`} onClick={onClick} style={{ cursor: 'pointer' }}>
            <line x1="-16" y1="0" x2="0" y2="0" stroke={stroke} strokeWidth="2" />
            <path d={arcs} fill="none" stroke={stroke} strokeWidth="2" />
            <line x1="48" y1="0" x2="66" y2="0" stroke={stroke} strokeWidth="2" />
            <text x="25" y="-18" textAnchor="middle" fill={C.text} fontSize="11" fontWeight="bold">{label}</text>
            {value && <text x="25" y="28" textAnchor="middle" fill={C.muted} fontSize="10">{value}</text>}
        </g>
    );
};

const Speaker: React.FC<SymbolProps> = ({ x, y, label, value, highlighted, onClick }) => {
    const stroke = highlighted ? C.highlight : C.component;
    return (
        <g transform={`translate(${x}, ${y})`} onClick={onClick} style={{ cursor: 'pointer' }}>
            <rect x="0" y="-20" width="18" height="40" fill={C.componentFill} stroke={stroke} strokeWidth="2" />
            <polygon points="18,-14 48,-32 48,32 18,14" fill={C.componentFill} stroke={stroke} strokeWidth="2" />
            <text x="24" y="-42" textAnchor="middle" fill={C.text} fontSize="11" fontWeight="bold">{label}</text>
            {value && <text x="24" y="50" textAnchor="middle" fill={C.muted} fontSize="10">{value}</text>}
        </g>
    );
};

const MOSFET: React.FC<SymbolProps> = ({ x, y, label, value, highlighted, onClick }) => {
    const stroke = highlighted ? C.highlight : C.component;
    return (
        <g transform={`translate(${x}, ${y})`} onClick={onClick} style={{ cursor: 'pointer' }}>
            <circle cx="0" cy="0" r="26" fill={C.componentFill} stroke={stroke} strokeWidth="2" />
            <line x1="-34" y1="0" x2="-12" y2="0" stroke={stroke} strokeWidth="2" />
            <line x1="-12" y1="-16" x2="-12" y2="16" stroke={stroke} strokeWidth="2" />
            <line x1="-4" y1="-18" x2="-4" y2="-6" stroke={stroke} strokeWidth="2" />
            <line x1="-4" y1="6" x2="-4" y2="18" stroke={stroke} strokeWidth="2" />
            <line x1="-4" y1="-18" x2="24" y2="-18" stroke={stroke} strokeWidth="2" />
            <line x1="-4" y1="18" x2="24" y2="18" stroke={stroke} strokeWidth="2" />
            <line x1="24" y1="-18" x2="24" y2="-34" stroke={stroke} strokeWidth="2" />
            <line x1="24" y1="18" x2="24" y2="34" stroke={stroke} strokeWidth="2" />
            <polygon points="-6,4 2,0 -6,-4" fill={stroke} />
            <text x="0" y="-38" textAnchor="middle" fill={C.text} fontSize="11" fontWeight="bold">{label}</text>
            {value && <text x="0" y="48" textAnchor="middle" fill={C.muted} fontSize="10">{value}</text>}
        </g>
    );
};

const ICBlock: React.FC<{
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    pins: string[];
    highlighted?: boolean;
    onClick?: () => void;
}> = ({ x, y, width, height, label, pins, highlighted, onClick }) => {
    const stroke = highlighted ? C.highlight : C.icStroke;

    return (
        <g transform={`translate(${x}, ${y})`} onClick={onClick} style={{ cursor: 'pointer' }}>
            <rect x="0" y="0" width={width} height={height} rx="8" fill={C.icFill} stroke={stroke} strokeWidth="2.5" />
            <text x={width / 2} y={height / 2 + 4} textAnchor="middle" fill={C.text} fontSize="13" fontWeight="bold">
                {label}
            </text>

            {pins.map((pin, i) => {
                const left = i < Math.ceil(pins.length / 2);
                const pinY = 18 + (i % Math.ceil(pins.length / 2)) * 22;
                const pinX = left ? 0 : width;
                const textX = left ? -8 : width + 8;
                return (
                    <g key={pin}>
                        <line
                            x1={pinX}
                            y1={pinY}
                            x2={left ? -16 : width + 16}
                            y2={pinY}
                            stroke={stroke}
                            strokeWidth="2"
                        />
                        <text
                            x={textX}
                            y={pinY + 4}
                            textAnchor={left ? 'end' : 'start'}
                            fill={C.muted}
                            fontSize="9"
                        >
                            {pin}
                        </text>
                    </g>
                );
            })}
        </g>
    );
};

const Ground: React.FC<{ x: number; y: number }> = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
        <line x1="0" y1="0" x2="0" y2="10" stroke={C.gnd} strokeWidth="2" />
        <line x1="-12" y1="10" x2="12" y2="10" stroke={C.gnd} strokeWidth="2" />
        <line x1="-8" y1="16" x2="8" y2="16" stroke={C.gnd} strokeWidth="2" />
        <line x1="-4" y1="22" x2="4" y2="22" stroke={C.gnd} strokeWidth="2" />
        <text x="0" y="40" textAnchor="middle" fill={C.gnd} fontSize="10">GND</text>
    </g>
);

const PowerRail: React.FC<{ x: number; y: number; label: string }> = ({ x, y, label }) => (
    <g transform={`translate(${x}, ${y})`}>
        <line x1="-20" y1="0" x2="20" y2="0" stroke={C.power} strokeWidth="2" />
        <line x1="0" y1="0" x2="0" y2="18" stroke={C.power} strokeWidth="2" />
        <text x="0" y="-8" textAnchor="middle" fill={C.power} fontSize="11" fontWeight="bold">{label}</text>
    </g>
);

const getValue = (circuit: GeneratedCircuit, ref: string, fallback: string) => {
    const found = circuit.bom.find((item) => item.ref === ref || item.ref.includes(ref));
    return found?.value || fallback;
};

const ClassDSchematic: React.FC<{
    circuit: GeneratedCircuit;
    selected: string | null;
    setSelected: (value: string | null) => void;
}> = ({ circuit, selected, setSelected }) => {
    const mainIC = circuit.mainIC || 'IRS2092S';
    const lValue = getValue(circuit, 'L1', '22 µH');
    const cOut = getValue(circuit, 'Cout', '470 nF');
    const speaker = getValue(circuit, 'J2', '8 Ω');

    return (
        <svg viewBox="0 0 980 460" width="100%" height="100%" role="img">
            <rect x="0" y="0" width="980" height="460" rx="18" fill={C.bg} />
            <text x="30" y="36" fill={C.text} fontSize="18" fontWeight="bold">Schéma proposé — Classe D</text>
            <text x="30" y="60" fill={C.muted} fontSize="12">Chaîne signal + puissance + filtre LC</text>

            <Wire points={[{ x: 80, y: 230 }, { x: 135, y: 230 }]} />
            <Capacitor x={135} y={230} label="C1" value="100 nF" highlighted={selected === 'C1'} onClick={() => setSelected('C1')} />
            <Wire points={[{ x: 187, y: 230 }, { x: 230, y: 230 }]} />
            <Resistor x={230} y={230} label="R1" value="10 kΩ" highlighted={selected === 'R1'} onClick={() => setSelected('R1')} />
            <Wire points={[{ x: 296, y: 230 }, { x: 350, y: 230 }]} />

            <ICBlock
                x={350}
                y={160}
                width={150}
                height={140}
                label={mainIC}
                pins={['IN+', 'IN-', 'GND', 'HO', 'LO', 'VCC', 'VS']}
                highlighted={selected === 'U1'}
                onClick={() => setSelected('U1')}
            />

            <Wire points={[{ x: 500, y: 205 }, { x: 560, y: 205 }]} />
            <MOSFET x={595} y={190} label="Q1" value="N-MOS" highlighted={selected === 'Q1-Q2'} onClick={() => setSelected('Q1-Q2')} />
            <Wire points={[{ x: 500, y: 255 }, { x: 560, y: 255 }]} />
            <MOSFET x={595} y={270} label="Q2" value="N-MOS" highlighted={selected === 'Q1-Q2'} onClick={() => setSelected('Q1-Q2')} />

            <Wire points={[{ x: 620, y: 224 }, { x: 670, y: 230 }]} />
            <Wire points={[{ x: 620, y: 236 }, { x: 670, y: 230 }]} />
            <Node x={670} y={230} />

            <Wire points={[{ x: 670, y: 230 }, { x: 725, y: 230 }]} />
            <Inductor x={725} y={230} label="L1" value={lValue} highlighted={selected === 'L1'} onClick={() => setSelected('L1')} />
            <Wire points={[{ x: 790, y: 230 }, { x: 840, y: 230 }]} />

            <Capacitor x={812} y={252} label="Cout" value={cOut} vertical highlighted={selected === 'Cout1'} onClick={() => setSelected('Cout1')} />
            <Wire points={[{ x: 838, y: 252 }, { x: 838, y: 330 }]} />
            <Ground x={838} y={330} />

            <Speaker x={865} y={230} label="HP" value={speaker} highlighted={selected === 'J2'} onClick={() => setSelected('J2')} />

            <PowerRail x={595} y={95} label="+VCC" />
            <Wire points={[{ x: 595, y: 113 }, { x: 595, y: 155 }]} highlighted={selected === 'power'} />

            <Ground x={595} y={335} />
            <Wire points={[{ x: 595, y: 304 }, { x: 595, y: 335 }]} />

            <text x="70" y="220" fill={C.text} fontSize="12">Audio IN</text>
            <text x="700" y="200" fill={C.muted} fontSize="11">Filtre passe-bas</text>
            <text x="560" y="355" fill={C.muted} fontSize="11">Demi-pont MOSFET</text>
        </svg>
    );
};

const ClassABSchematic: React.FC<{
    circuit: GeneratedCircuit;
    selected: string | null;
    setSelected: (value: string | null) => void;
}> = ({ circuit, selected, setSelected }) => {
    const mainIC = circuit.mainIC || 'LM3886';
    const speaker = getValue(circuit, 'J2', '8 Ω');

    return (
        <svg viewBox="0 0 980 460" width="100%" height="100%" role="img">
            <rect x="0" y="0" width="980" height="460" rx="18" fill={C.bg} />
            <text x="30" y="36" fill={C.text} fontSize="18" fontWeight="bold">Schéma proposé — Classe AB</text>
            <text x="30" y="60" fill={C.muted} fontSize="12">Entrée audio + amplificateur linéaire + feedback + sortie HP</text>

            <Wire points={[{ x: 80, y: 230 }, { x: 140, y: 230 }]} />
            <Capacitor x={140} y={230} label="C1" value="1 µF" highlighted={selected === 'C1'} onClick={() => setSelected('C1')} />
            <Wire points={[{ x: 192, y: 230 }, { x: 235, y: 230 }]} />
            <Resistor x={235} y={230} label="R1" value="22 kΩ" highlighted={selected === 'R1'} onClick={() => setSelected('R1')} />
            <Wire points={[{ x: 301, y: 230 }, { x: 380, y: 230 }]} />

            <ICBlock
                x={380}
                y={155}
                width={170}
                height={150}
                label={mainIC}
                pins={['IN+', 'IN-', 'V+', 'V-', 'OUT', 'MUTE']}
                highlighted={selected === 'U1'}
                onClick={() => setSelected('U1')}
            />

            <Wire points={[{ x: 550, y: 230 }, { x: 660, y: 230 }]} />
            <Resistor x={660} y={230} label="Rs" value="0.22Ω" highlighted={selected === 'Rs1'} onClick={() => setSelected('Rs1')} />
            <Wire points={[{ x: 726, y: 230 }, { x: 835, y: 230 }]} />
            <Speaker x={855} y={230} label="HP" value={speaker} highlighted={selected === 'J2'} onClick={() => setSelected('J2')} />

            <Wire
                points={[
                    { x: 610, y: 230 },
                    { x: 610, y: 120 },
                    { x: 330, y: 120 },
                    { x: 330, y: 205 },
                    { x: 380, y: 205 },
                ]}
                highlighted={selected === 'feedback'}
            />
            <Resistor x={430} y={120} label="Rfb2" value="22k/33k" highlighted={selected === 'feedback'} onClick={() => setSelected('feedback')} />
            <Resistor x={330} y={170} label="Rfb1" value="1 kΩ" highlighted={selected === 'feedback'} onClick={() => setSelected('feedback')} />

            <PowerRail x={465} y={85} label="+VCC" />
            <Wire points={[{ x: 465, y: 103 }, { x: 465, y: 155 }]} />

            <PowerRail x={505} y={355} label="-VCC" />
            <Wire points={[{ x: 505, y: 305 }, { x: 505, y: 355 }]} />

            <Ground x={330} y={305} />
            <Wire points={[{ x: 330, y: 236 }, { x: 330, y: 305 }]} />

            <text x="70" y="220" fill={C.text} fontSize="12">Audio IN</text>
            <text x="400" y="105" fill={C.muted} fontSize="11">Boucle de feedback</text>
            <text x="420" y="340" fill={C.muted} fontSize="11">Alimentation symétrique</text>
        </svg>
    );
};

const CircuitSchematic: React.FC<CircuitSchematicProps> = ({ circuit, ampClass }) => {
    const [selected, setSelected] = useState<string | null>(null);

    const selectedComponent = useMemo(() => {
        if (!selected) return null;

        if (selected === 'feedback') {
            return {
                ref: 'Feedback',
                name: 'Boucle de contre-réaction',
                value: 'Rfb1 + Rfb2',
                role: 'Définit le gain et stabilise l’amplificateur.',
                rating: 'Rfb1 = 1 kΩ, Rfb2 = 22 kΩ ou 33 kΩ',
            };
        }

        if (selected === 'power') {
            return {
                ref: 'Power',
                name: 'Alimentation',
                value: 'Rail principal',
                role: 'Fournit l’énergie à l’étage de puissance.',
                rating: 'À dimensionner avec marge de tension et courant.',
            };
        }

        return circuit.bom.find((item) => item.ref === selected || item.ref.includes(selected)) || null;
    }, [selected, circuit.bom]);

    return (
        <div
            style={{
                marginTop: '2rem',
                border: '1px solid rgba(0, 242, 255, 0.35)',
                borderRadius: '1.2rem',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)',
            }}
        >
            <div
                style={{
                    padding: '1rem 1.2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    alignItems: 'center',
                }}
            >
                <div>
                    <h3 style={{ margin: 0, color: 'var(--accent-cyan)', fontSize: '1.15rem' }}>
                        Schéma électronique généré
                    </h3>
                    <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Cliquez sur un composant pour voir son rôle et sa valeur.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setSelected(null)}
                    style={{
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'white',
                        padding: '0.45rem 0.8rem',
                        borderRadius: '0.7rem',
                        cursor: 'pointer',
                    }}
                >
                    Réinitialiser
                </button>
            </div>

            <div style={{ height: '460px', width: '100%' }}>
                {ampClass === 'Class D' ? (
                    <ClassDSchematic circuit={circuit} selected={selected} setSelected={setSelected} />
                ) : (
                    <ClassABSchematic circuit={circuit} selected={selected} setSelected={setSelected} />
                )}
            </div>

            <div
                style={{
                    padding: '1rem 1.2rem',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                }}
            >
                <div>
                    <h4 style={{ margin: '0 0 0.6rem', color: 'white' }}>Composant sélectionné</h4>
                    {selectedComponent ? (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            <strong style={{ color: 'var(--accent-cyan)' }}>{selectedComponent.ref}</strong> — {selectedComponent.name}<br />
                            <strong>Valeur :</strong> {selectedComponent.value}<br />
                            <strong>Calibre :</strong> {selectedComponent.rating}<br />
                            <strong>Rôle :</strong> {selectedComponent.role}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Aucun composant sélectionné.
                        </p>
                    )}
                </div>

                <div>
                    <h4 style={{ margin: '0 0 0.6rem', color: 'white' }}>Avertissements conception</h4>
                    {circuit.warnings.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            {circuit.warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Aucun avertissement critique détecté.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CircuitSchematic;
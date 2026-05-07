import { useState } from 'react';
import type { CalculationResults, UserParams } from '../logic/amplifierCalculator';
import { calculateAmplifier } from '../logic/amplifierCalculator';
import { generatePDFReport } from '../logic/pdfGenerator';
import { Zap, Thermometer, ShieldCheck, Download, Save, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface Props {
  results: CalculationResults;
  params: UserParams;
  isExpert: boolean;
  isPremium: boolean;
  onSave: () => void;
}

// ── Schéma SVG Classe AB ──────────────────────────────────────
function SchematicAB({ vcc, rl }: { vcc: number; rl: number }) {
  const [selected, setSelected] = useState<string | null>(null);

  const info: Record<string, string> = {
    C1: 'C1 — Condensateur de couplage (1 µF)\nBloque le DC, laisse passer l\'audio à 20 Hz.',
    R1: 'R1 — Résistance d\'entrée (22 kΩ)\nAdaptation impédance entre source et ampli.',
    LM3886: `LM3886 / TDA7294 — CI amplificateur intégré\nAmplifie le signal audio. Alimenté en ±${vcc} V.`,
    Rfb1: 'Rfb1 — Résistance feedback (1 kΩ)\nFixe le gain avec Rfb2.',
    Rfb2: 'Rfb2 — Résistance feedback (22 kΩ)\nGain = 1 + 22k/1k = 23× (≈ 27 dB).',
    Rs: 'Rs — Résistance série de sortie (0.22 Ω)\nProtège contre les oscillations HF.',
    HP: `HP — Haut-parleur (${rl} Ω)\nCharge résistive principale de l\'amplificateur.`,
  };

  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontWeight: 600 }}>
        Schéma proposé — Classe AB
      </p>
      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        Entrée audio + amplificateur linéaire + feedback + sortie HP
      </p>
      <svg viewBox="0 0 700 260" style={{ width: '100%', background: 'transparent' }}>
        {/* Lignes signal */}
        <line x1="60" y1="130" x2="110" y2="130" stroke="#00f2ff" strokeWidth="1.5" />
        <line x1="155" y1="130" x2="205" y2="130" stroke="#00f2ff" strokeWidth="1.5" />
        <line x1="250" y1="130" x2="275" y2="130" stroke="#00f2ff" strokeWidth="1.5" />
        <line x1="425" y1="130" x2="475" y2="130" stroke="#00f2ff" strokeWidth="1.5" />
        <line x1="510" y1="130" x2="560" y2="130" stroke="#00f2ff" strokeWidth="1.5" />
        <line x1="620" y1="130" x2="650" y2="130" stroke="#00f2ff" strokeWidth="1.5" />
        {/* Feedback */}
        <line x1="360" y1="60" x2="360" y2="30" stroke="#ff4b2b" strokeWidth="1.5" />
        <line x1="300" y1="30" x2="420" y2="30" stroke="#ff4b2b" strokeWidth="1.5" strokeDasharray="4" />
        <line x1="300" y1="30" x2="300" y2="90" stroke="#ff4b2b" strokeWidth="1.5" />
        <line x1="300" y1="90" x2="275" y2="90" stroke="#ff4b2b" strokeWidth="1.5" />
        <text x="360" y="25" fill="#ff4b2b" fontSize="9" textAnchor="middle">+VCC</text>
        {/* GND */}
        <line x1="360" y1="200" x2="360" y2="220" stroke="#888" strokeWidth="1.5" />
        <line x1="345" y1="220" x2="375" y2="220" stroke="#888" strokeWidth="1.5" />
        <line x1="350" y1="224" x2="370" y2="224" stroke="#888" strokeWidth="1" />
        <text x="360" y="242" fill="#888" fontSize="9" textAnchor="middle">GND</text>
        <text x="30" y="125" fill="#a0a0a8" fontSize="9">Audio</text>
        <text x="30" y="135" fill="#a0a0a8" fontSize="9">IN</text>
        {/* C1 */}
        <g onClick={() => setSelected(selected === 'C1' ? null : 'C1')} style={{ cursor: 'pointer' }}>
          <rect x="110" y="118" width="18" height="24" rx="2" fill={selected === 'C1' ? 'rgba(0,242,255,0.2)' : 'rgba(255,255,255,0.04)'} stroke={selected === 'C1' ? '#00f2ff' : '#444'} strokeWidth="1" />
          <line x1="116" y1="118" x2="116" y2="142" stroke="#00f2ff" strokeWidth="2" />
          <line x1="122" y1="118" x2="122" y2="142" stroke="#00f2ff" strokeWidth="2" />
          <text x="119" y="155" fill="#a0a0a8" fontSize="8" textAnchor="middle">C1</text>
          <text x="119" y="164" fill="#666" fontSize="7" textAnchor="middle">1 µF</text>
        </g>
        {/* R1 */}
        <g onClick={() => setSelected(selected === 'R1' ? null : 'R1')} style={{ cursor: 'pointer' }}>
          <rect x="205" y="120" width="45" height="20" rx="3" fill={selected === 'R1' ? 'rgba(0,242,255,0.2)' : 'rgba(255,255,255,0.04)'} stroke={selected === 'R1' ? '#00f2ff' : '#444'} strokeWidth="1" />
          <text x="227" y="133" fill="white" fontSize="9" textAnchor="middle">R1</text>
          <text x="227" y="153" fill="#a0a0a8" fontSize="8" textAnchor="middle">22 kΩ</text>
        </g>
        {/* LM3886 */}
        <g onClick={() => setSelected(selected === 'LM3886' ? null : 'LM3886')} style={{ cursor: 'pointer' }}>
          <rect x="275" y="60" width="150" height="140" rx="8"
            fill={selected === 'LM3886' ? 'rgba(0,114,255,0.25)' : 'rgba(0,114,255,0.1)'}
            stroke={selected === 'LM3886' ? '#0072ff' : 'rgba(0,114,255,0.5)'} strokeWidth="1.5" />
          <text x="350" y="120" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">LM3886</text>
          <text x="350" y="135" fill="#a0a0a8" fontSize="9" textAnchor="middle">/ TDA7294</text>
          <text x="350" y="155" fill="#555" fontSize="8" textAnchor="middle">±{vcc}V</text>
          <text x="282" y="133" fill="#00f2ff" fontSize="7">IN+</text>
          <text x="405" y="133" fill="#00f2ff" fontSize="7">OUT</text>
        </g>
        {/* Rfb1 */}
        <g onClick={() => setSelected(selected === 'Rfb1' ? null : 'Rfb1')} style={{ cursor: 'pointer' }}>
          <rect x="290" y="83" width="35" height="16" rx="3" fill={selected === 'Rfb1' ? 'rgba(255,75,43,0.2)' : 'rgba(255,255,255,0.04)'} stroke={selected === 'Rfb1' ? '#ff4b2b' : '#444'} strokeWidth="1" />
          <text x="307" y="94" fill="white" fontSize="8" textAnchor="middle">Rfb1</text>
          <text x="307" y="78" fill="#a0a0a8" fontSize="7" textAnchor="middle">1 kΩ</text>
        </g>
        {/* Rfb2 */}
        <g onClick={() => setSelected(selected === 'Rfb2' ? null : 'Rfb2')} style={{ cursor: 'pointer' }}>
          <rect x="330" y="83" width="35" height="16" rx="3" fill={selected === 'Rfb2' ? 'rgba(255,75,43,0.2)' : 'rgba(255,255,255,0.04)'} stroke={selected === 'Rfb2' ? '#ff4b2b' : '#444'} strokeWidth="1" />
          <text x="347" y="94" fill="white" fontSize="8" textAnchor="middle">Rfb2</text>
          <text x="347" y="78" fill="#a0a0a8" fontSize="7" textAnchor="middle">22 kΩ</text>
        </g>
        {/* Rs */}
        <g onClick={() => setSelected(selected === 'Rs' ? null : 'Rs')} style={{ cursor: 'pointer' }}>
          <rect x="475" y="120" width="35" height="20" rx="3" fill={selected === 'Rs' ? 'rgba(0,242,255,0.2)' : 'rgba(255,255,255,0.04)'} stroke={selected === 'Rs' ? '#00f2ff' : '#444'} strokeWidth="1" />
          <text x="492" y="133" fill="white" fontSize="8" textAnchor="middle">Rs</text>
          <text x="492" y="152" fill="#a0a0a8" fontSize="7" textAnchor="middle">0.22 Ω</text>
        </g>
        {/* HP */}
        <g onClick={() => setSelected(selected === 'HP' ? null : 'HP')} style={{ cursor: 'pointer' }}>
          <polygon points="560,112 580,120 580,140 560,148" fill={selected === 'HP' ? 'rgba(0,242,255,0.15)' : 'rgba(255,255,255,0.05)'} stroke={selected === 'HP' ? '#00f2ff' : '#666'} strokeWidth="1.5" />
          <line x1="580" y1="113" x2="595" y2="105" stroke={selected === 'HP' ? '#00f2ff' : '#666'} strokeWidth="1.5" />
          <line x1="580" y1="147" x2="595" y2="155" stroke={selected === 'HP' ? '#00f2ff' : '#666'} strokeWidth="1.5" />
          <line x1="595" y1="105" x2="595" y2="155" stroke={selected === 'HP' ? '#00f2ff' : '#666'} strokeWidth="1.5" />
          <line x1="595" y1="130" x2="620" y2="130" stroke="#00f2ff" strokeWidth="1.5" />
          <text x="585" y="172" fill="#a0a0a8" fontSize="8" textAnchor="middle">HP</text>
          <text x="585" y="181" fill="#555" fontSize="7" textAnchor="middle">{rl} Ω</text>
        </g>
        <text x="300" y="22" fill="#ff4b2b" fontSize="8">Boucle de Feedback</text>
        <text x="360" y="252" fill="#555" fontSize="8" textAnchor="middle">Alimentation symétrique</text>
      </svg>

      {/* Info composant */}
      <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', fontSize: '0.82rem', minHeight: '55px', whiteSpace: 'pre-line' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Composant sélectionné</span>
        <p style={{ marginTop: '0.3rem', color: selected ? 'white' : 'var(--text-muted)' }}>
          {selected ? info[selected] ?? selected : 'Aucun composant sélectionné.'}
        </p>
      </div>
    </div>
  );
}

// ── Schéma Classe D ───────────────────────────────────────────
function SchematicD({ vcc, rl }: { vcc: number; rl: number }) {
  const [selected, setSelected] = useState<string | null>(null);

  const blocks = [
    { id: 'IN', label: 'IN', sub: 'Audio', highlight: false },
    { id: 'LC', label: 'L/C', sub: 'Filtre E.', highlight: false },
    { id: 'IRS', label: 'IRS2092S', sub: 'Ctrl PWM', highlight: true },
    { id: 'HB', label: 'H-Bridge', sub: 'MOSFETs', highlight: false },
    { id: 'FILT', label: 'LC Filter', sub: 'Passe-bas', highlight: false },
    { id: 'HP', label: 'HP', sub: `${rl} Ω`, highlight: false },
  ];

  const info: Record<string, string> = {
    IN: 'Entrée audio analogique\nSignal faible niveau (100 mV – 2 Vrms).',
    LC: 'Filtre RC d\'entrée\n10 kΩ + 100 nF — Limite la bande passante.',
    IRS: `IRS2092S — Contrôleur PWM\nGénère les signaux PWM à 400 kHz.\nProtection DC, overcurrent, dead-time intégrés.`,
    HB: `Pont en H — 4 MOSFETs N-Ch\nVbus = ${vcc} V. Commutation à 400 kHz.`,
    FILT: 'Filtre LC de sortie\nFiltre la porteuse PWM (fc ≈ 22 kHz).',
    HP: `Haut-parleur : ${rl} Ω`,
  };

  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Schéma de principe (Classe D) :</p>
      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '0.75rem', padding: '1.25rem 1rem', border: '1px solid var(--border-glass)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: '500px' }}>
          {blocks.map((b, i) => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div onClick={() => setSelected(selected === b.id ? null : b.id)} style={{
                padding: '0.5rem 0.65rem', border: `1.5px solid ${selected === b.id ? '#00f2ff' : b.highlight ? '#0072ff' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '0.5rem', textAlign: 'center', cursor: 'pointer', minWidth: '68px',
                background: selected === b.id ? 'rgba(0,242,255,0.1)' : b.highlight ? 'rgba(0,114,255,0.15)' : 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: b.highlight ? '#60a5fa' : 'white' }}>{b.label}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{b.sub}</div>
              </div>
              {i < blocks.length - 1 && <div style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', padding: '0 0.2rem' }}>→</div>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#555', marginTop: '0.75rem' }}>
          Alimentation {vcc} V DC
        </div>
      </div>
      <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', border: '1px solid var(--border-glass)', fontSize: '0.82rem', minHeight: '55px', whiteSpace: 'pre-line' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Composant sélectionné</span>
        <p style={{ marginTop: '0.3rem', color: selected ? 'white' : 'var(--text-muted)' }}>
          {selected ? info[selected] : 'Aucun composant sélectionné. Cliquez sur un bloc.'}
        </p>
      </div>
    </div>
  );
}

// ── Tableau comparatif ────────────────────────────────────────
function ComparisonTable({ params }: { params: UserParams }) {
  const ab = calculateAmplifier({ ...params, ampClass: 'Class AB' });
  const d = calculateAmplifier({ ...params, ampClass: 'Class D' });
  const recommended = d.efficiency > ab.efficiency ? 'Class D' : 'Class AB';

  return (
    <div className="glass-card" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ fontWeight: 700 }}>Comparatif : Classe AB vs Classe D</h3>
        <div style={{ padding: '0.35rem 0.9rem', background: 'rgba(0,255,128,0.1)', border: '1px solid rgba(0,255,128,0.2)', borderRadius: '2rem', fontSize: '0.78rem', color: '#00ff80', fontWeight: 700 }}>
          Architecture recommandée : {recommended}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
              {['Classe', 'Rendement', 'Dissipation', 'Complexité', 'Coût', 'Verdict'].map(h => (
                <th key={h} style={{ textAlign: h === 'Classe' ? 'left' : 'center', padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(['Class AB', 'Class D'] as const).map((cls) => {
              const res = cls === 'Class AB' ? ab : d;
              const isRec = cls === recommended;
              return (
                <tr key={cls} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {cls}
                      {isRec && <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.45rem', background: 'rgba(0,255,128,0.15)', color: '#00ff80', borderRadius: '1rem', fontWeight: 800 }}>RECOMMANDÉ</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--accent-cyan)' }}>{res.efficiency.toFixed(0)}%</td>
                  <td style={{ textAlign: 'center', padding: '0.75rem' }}>{res.pdTotal.toFixed(0)} W</td>
                  <td style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--text-muted)' }}>{cls === 'Class AB' ? 'Basse' : 'Haute'}</td>
                  <td style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--text-muted)' }}>Moyen</td>
                  <td style={{ textAlign: 'center', padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: res.recommendation.verdict === 'Functional' ? '#00ff80' : res.recommendation.verdict === 'Risk' ? 'var(--accent-orange)' : 'var(--accent-red)' }}>
                      {res.recommendation.verdict === 'Functional' ? '✅ Viable' : res.recommendation.verdict === 'Risk' ? '⚠️ Risque' : '❌ Échec'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────
export default function ResultsDashboard({ results, params, isExpert, onSave }: Props) {
  const { recommendation: rec } = results;
  const vOutRms = parseFloat((results.vPeak / Math.sqrt(2)).toFixed(1));
  const iRms = parseFloat((results.iPeak / Math.sqrt(2)).toFixed(2));
  const thd = params.ampClass === 'Class AB' ? '0.1%' : '0.5%';

  const heatsinkNote = params.ampClass === 'Class AB'
    ? `Dissipateur ≥ ${results.heatsinkArea.toFixed(0)} cm²`
    : 'Via plan de cuivre PCB';

  const mainIC = params.ampClass === 'Class AB' ? 'LM3886 / TDA7294' : 'IRS2092S';
  const minCurrent = (results.iPeak * 1.2).toFixed(1);
  const vLabel = params.supplyType === 'Symmetrical' ? `±${params.supplyVoltage} V` : `${params.supplyVoltage} V`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Métriques ── */}
      <div className="results-grid">
        {[
          { icon: <Zap size={14} />, label: 'TENSION SORTIE', value: vOutRms, unit: 'Vrms', sub: `Crête: ${results.vPeak}V | THD: ${thd}`, color: 'var(--accent-cyan)' },
          { icon: <Zap size={14} />, label: 'COURANT', value: iRms, unit: 'Arms', sub: `Crête: ${results.iPeak} A`, color: 'var(--accent-blue)' },
          { icon: <Thermometer size={14} />, label: 'DISSIPATION', value: results.pdTotal, unit: 'W', sub: `Efficacité: ${results.efficiency}% | Tj: ${Math.round(results.pdPerDevice * (1 / results.rthRequired) + params.ambientTemp)}°C`, color: results.pdTotal > 30 ? 'var(--accent-red)' : 'var(--accent-orange)' },
          { icon: <ShieldCheck size={14} />, label: 'P. MAX THÉORIQUE', value: results.realPower, unit: 'W', sub: 'Limite Alim', color: 'var(--accent-green)' },
        ].map((m, i) => (
          <div key={i} className="glass-card metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: m.color }}>{m.icon}</span>
              <span className="metric-label">{m.label}</span>
            </div>
            <div>
              <span className="metric-value" style={{ color: m.color }}>{m.value}</span>
              <span className="metric-unit">{m.unit}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Verdict ── */}
      <div className="glass-card verdict-card">
        <div className="verdict-header">
          {rec.verdict === 'Functional' ? <CheckCircle size={22} color="#00ff80" /> : rec.verdict === 'Risk' ? <AlertTriangle size={22} color="var(--accent-orange)" /> : <XCircle size={22} color="var(--accent-red)" />}
          <span>Verdict du Système :</span>
          <span className={`badge badge-${rec.verdict === 'Functional' ? 'functional' : rec.verdict === 'Risk' ? 'risk' : 'failed'}`}>{rec.verdict}</span>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1rem' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>BESOIN DISSIPATEUR THERMIQUE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{results.rthRequired.toFixed(2)} °C/W</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Une valeur plus faible = dissipateur plus volumineux. Cibler &lt; {results.rthRequired.toFixed(2)}.</div>
        </div>
        {rec.warnings.length > 0 && (
          <ul className="reason-list">
            {rec.warnings.map((w, i) => (
              <li key={i} className="reason-item"><AlertTriangle size={14} color="var(--accent-orange)" className="reason-icon" /><span>{w}</span></li>
            ))}
          </ul>
        )}
        {rec.suggestions.length > 0 && (
          <ul className="reason-list">
            {rec.suggestions.map((s, i) => (
              <li key={i} className="reason-item"><Info size={14} color="var(--accent-cyan)" className="reason-icon" /><span style={{ color: 'var(--accent-cyan)' }}>{s}</span></li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Comparatif ── */}
      <ComparisonTable params={params} />

      {/* ── Solution Technique ── */}
      <div className="glass-card" style={{ borderColor: 'rgba(0,242,255,0.2)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} /> Solution Technique Détaillée : {params.ampClass}
        </h3>

        {/* Infos clés */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Composant principal', value: mainIC, highlight: true },
            { label: 'Refroidissement', value: heatsinkNote, highlight: false },
            { label: 'Alimentation recommandée', value: vLabel, highlight: true },
            { label: 'Courant Min Alim', value: `${minCurrent} A`, highlight: false },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
              <div style={{ fontWeight: 700, color: item.highlight ? 'var(--accent-cyan)' : 'white', fontSize: '0.92rem' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Schéma + BOM */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1.5rem', alignItems: 'start' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid var(--border-glass)' }}>
            {params.ampClass === 'Class AB'
              ? <SchematicAB vcc={results.vcc} rl={params.loadImpedance} />
              : <SchematicD vcc={results.vcc} rl={params.loadImpedance} />
            }
            {rec.warnings.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-orange)', marginBottom: '0.4rem' }}>Avertissements conception</div>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {rec.warnings.map((w, i) => <li key={i} style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* BOM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.25rem' }}>
              BOM : {params.ampClass}
            </h4>
            {results.stages.flatMap(s => s.components).slice(0, 8).map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.78rem', paddingBottom: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'white', fontSize: '0.76rem' }}>{c.label}</div>
                  {c.note && <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{c.note}</div>}
                </div>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginLeft: '0.4rem', whiteSpace: 'nowrap', fontSize: '0.76rem' }}>{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Paramètres globaux + Observations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.75rem' }}>Paramètres Techniques Globaux</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Swing de tension réel', value: `${results.vPeak.toFixed(2)} Vpk` },
                { label: 'Courant crête HP', value: `${results.iPeak.toFixed(2)} Apk` },
                { label: 'Architecture choisie', value: params.ampClass.replace('Class ', 'Classe '), color: 'var(--accent-cyan)' },
                { label: 'Dissipateur requis', value: heatsinkNote },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.label}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: (item as any).color || 'white', marginTop: '0.1rem' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>Observations et Analyse</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.35rem' }}>Pourquoi ce design ?</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {params.ampClass === 'Class D'
                ? `Le module IRS2092S est choisi pour son excellent rendement (${results.efficiency}%) et sa gestion thermique optimale à ${params.targetPower} W.`
                : `Le LM3886/TDA7294 offre une distorsion minimale (THD < 0.1%) et une intégration facile pour ${params.targetPower} W sur ${params.loadImpedance} Ω.`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Mode Expert ── */}
      {isExpert && (
        <div className="glass-card">
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Mode Expert — Détail des Étages</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {results.stages.map((stage, si) => (
              <div key={si}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>{stage.stageName}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {stage.components.map((c, ci) => (
                    <div key={ci} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', fontSize: '0.82rem', gap: '1rem' }}>
                      <div>
                        <span style={{ fontWeight: 600 }}>{c.label}</span>
                        {c.note && <span style={{ color: 'var(--text-muted)', fontSize: '0.73rem', marginLeft: '0.5rem' }}>— {c.note}</span>}
                      </div>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, whiteSpace: 'nowrap' }}>{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Boutons ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button className="download-btn" onClick={() => generatePDFReport(results, params)} style={{ margin: 0 }}>
          <Download size={18} /> Télécharger le Rapport Complet (PDF)
        </button>
        <button onClick={onSave} style={{ background: 'rgba(0,255,128,0.1)', border: '1px solid rgba(0,255,128,0.2)', color: '#00ff80', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.95rem', transition: 'all 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,255,128,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,255,128,0.1)')}
        >
          <Save size={18} /> Sauvegarder l'analyse
        </button>
      </div>
    </div>
  );
}
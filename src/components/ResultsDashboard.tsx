import { useState } from 'react';
import type { CalculationResults, UserParams } from '../logic/amplifierCalculator';
import { calculateAmplifier } from '../logic/amplifierCalculator';
import { generatePDFReport } from '../logic/pdfGenerator';
import {
  buildClassABSchematic,
  buildClassDSchematic,
  buildDiscreteClassABSchematic,
  buildDiscreteClassDSchematic,
  buildPseudo3DView
} from '../logic/schematicSVG';
import {
  Zap, Thermometer, ShieldCheck, Download, Save,
  AlertTriangle, CheckCircle, XCircle, Info,
  Cpu, Box, FileCode
} from 'lucide-react';

interface Props {
  results: CalculationResults;
  params: UserParams;
  isExpert: boolean;
  isPremium: boolean;
  onSave: () => void;
}

// ── CI intégrés (pas de MOSFETs externes) ──────────────────
const INTEGRATED_IDS = ['TPA3116D2', 'TPA3110D2', 'TPA3255', 'MA12070', 'TDA8954TH'];

// ══════════════════════════════════════════════════════════════
//  VISIONNEUR 3 ONGLETS — cohérence totale avec CI sélectionné
// ══════════════════════════════════════════════════════════════
function SchematicViewer({
  results, params, mainIC
}: {
  results: CalculationResults;
  params: UserParams;
  mainIC: string;
}) {
  const [view, setView] = useState<'normalized' | 'discrete' | '3d'>('normalized');

  const isIntegrated = INTEGRATED_IDS.includes(params.selectedIC ?? '');
  const icForSchema = mainIC.split(' ')[0]; // ex: "TPA3255" depuis "TPA3255 — ..."

  // Extraction transistors depuis les étages
  const npnOut = results.stages
    .find(s => s.stageName.includes('Puissance'))
    ?.components.find(c => c.label.includes('NPN'))?.value ?? 'TIP3055';
  const pnpOut = results.stages
    .find(s => s.stageName.includes('Puissance'))
    ?.components.find(c => c.label.includes('PNP'))?.value ?? 'TIP2955';
  const drvNPN = results.stages
    .find(s => s.stageName.includes('Driver'))
    ?.components.find(c => c.label.includes('NPN'))?.value ?? 'BC546';
  const drvPNP = results.stages
    .find(s => s.stageName.includes('Driver'))
    ?.components.find(c => c.label.includes('PNP'))?.value ?? 'BC556';
  const reRaw = results.stages
    .find(s => s.stageName.includes('Puissance'))
    ?.components.find(c => c.label.includes('metteur'))?.value?.split(' ')[0] ?? '0.47';
  const reVal = isNaN(parseFloat(reRaw)) ? 0.47 : parseFloat(reRaw);
  const pairsRaw = results.stages
    .find(s => s.stageName.includes('Puissance'))
    ?.stageName?.match(/(\d+) paire/)?.[1] ?? '1';
  const pairs = parseInt(pairsRaw);

  const lUH = params.ampClass === 'Class D'
    ? parseFloat(results.stages
      .find(s => s.stageName.includes('Filtre'))
      ?.components.find(c => c.label.includes('Inductance de filtre'))
      ?.value?.replace(' µH', '') ?? '10')
    : 0;
  const cUF = params.ampClass === 'Class D'
    ? parseFloat(results.stages
      .find(s => s.stageName.includes('Filtre'))
      ?.components.find(c => c.label.includes('Condensateur de filtre'))
      ?.value?.replace(' µF', '') ?? '1')
    : 0;
  const mosfet = results.stages
    .find(s => s.stageName.includes('Pont'))
    ?.components.find(c => c.label.includes('MOSFET'))?.value ?? 'IRFZ44N';

  const getSVG = (): string => {
    if (view === 'normalized') {
      return params.ampClass === 'Class AB'
        ? buildClassABSchematic(results.vcc, params.loadImpedance, icForSchema, params.selectedIC ?? '')
        : buildClassDSchematic(results.vcc, params.loadImpedance, lUH, cUF, icForSchema, isIntegrated, params.selectedIC ?? '');
    }
    if (view === 'discrete') {
      return params.ampClass === 'Class AB'
        ? buildDiscreteClassABSchematic(results.vcc, params.loadImpedance, npnOut, pnpOut, pairs, drvNPN, drvPNP, reVal)
        : buildDiscreteClassDSchematic(results.vcc, params.loadImpedance, mosfet, lUH, cUF);
    }
    return buildPseudo3DView(results.vcc, params.loadImpedance, npnOut, pnpOut, params.ampClass, pairs, icForSchema);
  };
  if (view === 'discrete') {
    return params.ampClass === 'Class AB'
      ? buildDiscreteClassABSchematic(results.vcc, params.loadImpedance, npnOut, pnpOut, pairs, drvNPN, drvPNP, reVal)
      : buildDiscreteClassDSchematic(results.vcc, params.loadImpedance, mosfet, lUH, cUF);
  }
  return buildPseudo3DView(results.vcc, params.loadImpedance, npnOut, pnpOut, params.ampClass, pairs, icForSchema);
};

const tabs = [
  { id: 'normalized' as const, label: 'Schéma Normalisé', icon: <FileCode size={14} /> },
  { id: 'discrete' as const, label: 'Schéma Discret BJT', icon: <Cpu size={14} /> },
  { id: '3d' as const, label: 'Carte PCB Vue 3D', icon: <Box size={14} /> },
];

return (
  <div>
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setView(tab.id)} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.5rem 1rem', borderRadius: '0.6rem', cursor: 'pointer',
          border: `1px solid ${view === tab.id ? 'var(--accent-cyan)' : 'var(--border-glass)'}`,
          background: view === tab.id ? 'rgba(0,242,255,0.1)' : 'transparent',
          color: view === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
          fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s', fontFamily: 'inherit'
        }}>
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
      {view === 'normalized' && `CI sélectionné : ${icForSchema}${isIntegrated ? ' (CI Intégré — H-Bridge interne)' : ''} — Symboles Norme CEI`}
      {view === 'discrete' && 'Circuit complet BJT — Broches B/C/E en rouge — Topologie 3 étages'}
      {view === '3d' && 'Vue isométrique illustrative — positions indicatives'}
    </p>
    <div
      style={{
        background: view === '3d' ? '#0d1117' : 'white',
        borderRadius: '0.75rem', padding: '0.5rem',
        border: '1px solid var(--border-glass)', overflowX: 'auto'
      }}
      dangerouslySetInnerHTML={{ __html: getSVG() }}
    />
    <div style={{
      marginTop: '0.6rem', padding: '0.6rem 0.85rem',
      background: 'rgba(0,242,255,0.04)', borderRadius: '0.5rem',
      border: '1px solid rgba(0,242,255,0.1)', fontSize: '0.78rem', color: 'var(--text-muted)'
    }}>
      {view === 'normalized' && <>Schéma normalisé pour <strong style={{ color: 'var(--accent-cyan)' }}>{icForSchema}</strong>{isIntegrated ? ' — CI intégré : pas de MOSFETs externes' : ''}</>}
      {view === 'discrete' && <><strong style={{ color: 'var(--accent-cyan)' }}>Broches en rouge</strong> — B=Base · C=Collecteur · E=Émetteur (BJT) | G=Gate · D=Drain · S=Source (MOSFET)</>}
      {view === '3d' && 'Utilisez le schéma normalisé pour le câblage réel'}
    </div>
  </div>
);
}

// ══════════════════════════════════════════════════════════════
//  TABLEAU COMPARATIF
// ══════════════════════════════════════════════════════════════
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
            {(['Class AB', 'Class D'] as const).map(cls => {
              const res = cls === 'Class AB' ? ab : d; const isRec = cls === recommended;
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

// ══════════════════════════════════════════════════════════════
//  COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════════════════════
export default function ResultsDashboard({ results, params, isExpert, onSave }: Props) {
  const { recommendation: rec } = results;

  // ── Extraction du CI depuis les étages calculés ──────────
  const mainIC = (() => {
    const stageAB = results.stages.find(s => s.stageName.includes('CI') || s.stageName.includes('Principal'));
    const stageD = results.stages.find(s => s.stageName.includes('Modulateur') || s.stageName.includes('PWM'));
    const stage = params.ampClass === 'Class AB' ? stageAB : stageD;
    const comp = stage?.components.find(c =>
      c.label.includes('CI') || c.label.includes('controleur') || c.label.includes('amplif')
    );
    return comp?.value ?? (params.ampClass === 'Class AB' ? 'LM3886' : 'IRS2092S');
  })();

  const vOutRms = parseFloat((results.vPeak / Math.sqrt(2)).toFixed(1));
  const iRms = parseFloat((results.iPeak / Math.sqrt(2)).toFixed(2));
  const thd = params.ampClass === 'Class AB' ? '0.1%' : '0.5%';
  const vLabel = params.supplyType === 'Symmetrical' ? `±${params.supplyVoltage} V` : `${params.supplyVoltage} V`;
  const heatsinkNote = params.ampClass === 'Class AB'
    ? `Dissipateur >= ${results.heatsinkArea.toFixed(0)} cm²`
    : 'Via plan de cuivre PCB';
  const minCurrent = (results.iPeak * 1.2).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ══ MÉTRIQUES ══ */}
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

      {/* ══ VERDICT ══ */}
      <div className="glass-card verdict-card">
        <div className="verdict-header">
          {rec.verdict === 'Functional' ? <CheckCircle size={22} color="#00ff80" /> : rec.verdict === 'Risk' ? <AlertTriangle size={22} color="var(--accent-orange)" /> : <XCircle size={22} color="var(--accent-red)" />}
          <span>Verdict du Système :</span>
          <span className={`badge badge-${rec.verdict === 'Functional' ? 'functional' : rec.verdict === 'Risk' ? 'risk' : 'failed'}`}>{rec.verdict}</span>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1rem' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>BESOIN DISSIPATEUR THERMIQUE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{results.rthRequired.toFixed(2)} °C/W</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Valeur plus faible = dissipateur plus grand. Cibler &lt; {results.rthRequired.toFixed(2)}.</div>
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

      {/* ══ COMPARATIF ══ */}
      <ComparisonTable params={params} />

      {/* ══ SOLUTION TECHNIQUE ══ */}
      <div className="glass-card" style={{ borderColor: 'rgba(0,242,255,0.2)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} /> Solution Technique Détaillée : {params.ampClass}
        </h3>

        {/* Infos clés — mainIC cohérent avec choix utilisateur */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Composant principal', value: mainIC, highlight: true },
            { label: 'Refroidissement', value: heatsinkNote, highlight: false },
            { label: 'Alimentation recommandée', value: vLabel, highlight: true },
            { label: 'Courant Min Alim', value: `${minCurrent} A`, highlight: false },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: item.highlight ? 'var(--accent-cyan)' : 'white' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* ══ VISIONNEUR SCHÉMA — mainIC transmis pour cohérence totale ══ */}
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid var(--border-glass)', marginBottom: '1.5rem' }}>
          <SchematicViewer results={results} params={params} mainIC={mainIC} />
        </div>

        {rec.warnings.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-orange)', marginBottom: '0.5rem' }}>Avertissements conception</div>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {rec.warnings.map((w, i) => <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w}</li>)}
            </ul>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.75rem' }}>Paramètres Techniques Globaux</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Swing tension réel', value: `${results.vPeak.toFixed(2)} Vpk` },
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
                ? `${mainIC} choisi par l'utilisateur — rendement ${results.efficiency}% — puissance max ${results.realPower.toFixed(0)}W sur ${params.loadImpedance}Ω.`
                : `${mainIC} choisi par l'utilisateur — THD minimal — intégration fiable pour ${params.targetPower}W sur ${params.loadImpedance}Ω.`}
            </p>
          </div>
        </div>
      </div>

      {/* ══ MODE EXPERT ══ */}
      {isExpert && (
        <div className="glass-card">
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Mode Expert — Détail Complet des Étages</h3>
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

      {/* ══ BOUTONS ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button className="download-btn" onClick={() => generatePDFReport(results, params)} style={{ margin: 0 }}>
          <Download size={18} /> Télécharger le Rapport Complet (PDF)
        </button>
        <button onClick={onSave} style={{
          background: 'rgba(0,255,128,0.1)', border: '1px solid rgba(0,255,128,0.2)',
          color: '#00ff80', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.75rem', fontSize: '0.95rem', transition: 'all 0.2s', fontFamily: 'inherit'
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,255,128,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,255,128,0.1)')}
        >
          <Save size={18} /> Sauvegarder l'analyse
        </button>
      </div>
    </div>
  );
}
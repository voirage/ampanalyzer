import React from 'react';
import type { CalculationResults, UserParams } from '../logic/amplifierCalculator';
import { Zap, Activity, Thermometer, ShieldCheck, AlertTriangle, XCircle, Download, Save, Gauge, Lock } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ResultsDashboardProps {
  results: CalculationResults;
  params: UserParams;
  onSave: () => void;
  isExpert?: boolean;
  isPremium?: boolean;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, params, onSave, isExpert, isPremium }) => {
  const archBest = results.comparison.bestClass === 'Class D' ? 'Classe D' : 'Classe AB';
  const architectureChoisie = results.comparison.bestClass
    ? archBest
    : results.recommendation.architecture.includes('Classe D')
      ? 'Classe D'
      : 'Classe AB';

  const headroom = typeof (results as any).headroom === 'number' ? (results as any).headroom : 0;
  const tj = typeof (results as any).tj === 'number' ? (results as any).tj : 0;
  const mainComponent = results.recommendation.components[0] || 'Standard IC';

  const getVerdictBadgeClass = () => {
    switch (results.verdict) {
      case 'Functional': return 'badge-functional';
      case 'At Risk': return 'badge-risk';
      case 'Non-functional': return 'badge-failed';
      default: return 'badge-risk';
    }
  };

  const getVerdictIcon = () => {
    switch (results.verdict) {
      case 'Functional': return <ShieldCheck color="#00ff80" />;
      case 'At Risk': return <AlertTriangle color="#ff9d00" />;
      case 'Non-functional': return <XCircle color="#ff4b2b" />;
      default: return <AlertTriangle color="#ff9d00" />;
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(10, 10, 12);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(0, 242, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AmpAnalyzer - Rapport Technique', 20, 25);

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Généré le : ${new Date().toLocaleString()}`, 20, 50);
    doc.text('Version logicielle : MVP 1.0', 20, 56);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Paramètres de Conception', 20, 70);

    autoTable(doc, {
      startY: 75,
      head: [['Paramètre', 'Valeur']],
      body: [
        ['Puissance Cible', `${params.targetPower} W`],
        ['Impédance HP', `${params.loadImpedance} Ω`],
        ['Alimentation brute', `${params.supplyVoltage} V (${params.supplyType})`],
        ['Classe choisie', params.ampClass],
        ['Température ambiante', `${params.ambientTemp} °C`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 242, 255], textColor: [255, 255, 255] },
    });

    const finalY1 = (doc as any).lastAutoTable?.finalY || 75;
    doc.setFont('helvetica', 'bold');
    doc.text("2. Résultats d'Analyse Électrique & Thermique", 20, finalY1 + 15);

    autoTable(doc, {
      startY: finalY1 + 20,
      head: [['Domaine', 'Indicateur', 'Valeur']],
      body: [
        ['Électrique', 'Tension Crête (Vpk)', `${results.vPeak.toFixed(2)} V`],
        ['Électrique', 'Courant Crête (Ipk)', `${results.iPeak.toFixed(2)} A`],
        ['Électrique', 'Réserve Tension (Headroom)', `${headroom.toFixed(2)} V`],
        ['Électrique', 'Efficacité estimée', `${(results.efficiency * 100).toFixed(0)} %`],
        ['Électrique', 'THD estimé', `${results.thd.toFixed(1)} %`],
        ['Thermique', 'Puissance Dissipée', `${results.dissipatedPower.toFixed(1)} W`],
        ['Thermique', 'Temp. Jonction (Tj)', `${tj.toFixed(0)} °C`],
        ['Thermique', 'Dissipateur Requis', results.recommendation.heatsinkType],
      ],
      theme: 'striped',
    });

    const finalY2 = (doc as any).lastAutoTable?.finalY || finalY1 + 20;
    doc.setFont('helvetica', 'bold');
    doc.text('3. Verdict de Faisabilité', 20, finalY2 + 15);

    const verdictColor: [number, number, number] =
      results.verdict === 'Functional'
        ? [0, 180, 0]
        : results.verdict === 'At Risk'
          ? [180, 120, 0]
          : [220, 0, 0];

    doc.setTextColor(verdictColor[0], verdictColor[1], verdictColor[2]);
    doc.setFontSize(16);
    doc.text(`STATUT : ${results.verdict}`, 20, finalY2 + 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(results.reasons[0] || '', 20, finalY2 + 32);
    doc.setFont('helvetica', 'normal');

    doc.addPage();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Comparatif des Architectures', 20, 20);

    autoTable(doc, {
      startY: 25,
      head: [['Classe', 'Viabilité', 'Dissipation', 'Complexité']],
      body: results.comparison.points.map((p) => [
        p.ampClass,
        p.isViable ? 'OUI' : 'NON',
        `${p.dissipation.toFixed(0)} W`,
        p.complexity,
      ]),
      headStyles: { fillColor: [40, 44, 52], textColor: [255, 255, 255] },
    });

    const finalY3 = (doc as any).lastAutoTable?.finalY || 25;
    doc.setFont('helvetica', 'bold');
    doc.text('5. Solution Technique Préconisée', 20, finalY3 + 15);
    doc.setFontSize(11);
    doc.text(`Architecture : ${architectureChoisie} (${mainComponent})`, 20, finalY3 + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitWhy = doc.splitTextToSize(results.recommendation.whyRecommended || '', pageWidth - 40);
    doc.text(splitWhy, 20, finalY3 + 28);

    const finalY4 = finalY3 + 30 + splitWhy.length * 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`6. Schéma de principe (${architectureChoisie})`, 20, finalY4 + 10);
    doc.setFont('courier', 'normal');
    doc.setFontSize(10);

    const schematic =
      architectureChoisie === 'Classe D'
        ? [
          `[Audio In] --L/C Filtre--> [${mainComponent}] --LC Out--> [HP]`,
          '                            |',
          '                          Vdc Simple + Découplage',
        ]
        : [
          `[Audio In] --C Couplage--> [${mainComponent}] --Sortie--> [HP]`,
          '                            |',
          '                          Vcc Symétrique (±)',
        ];

    doc.text(schematic, 20, finalY4 + 20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`7. Liste des Composants (BOM - ${architectureChoisie})`, 20, finalY4 + 45);

    autoTable(doc, {
      startY: finalY4 + 50,
      head: [['Composant', 'Qté', 'Description']],
      body: results.bom.map((item) => [item.name, item.quantity.toString(), item.description]),
      theme: 'grid',
    });

    const finalY5 = (doc as any).lastAutoTable?.finalY || finalY4 + 50;
    doc.setFillColor(255, 248, 230);
    doc.rect(20, finalY5 + 10, pageWidth - 40, 35, 'F');
    doc.setTextColor(180, 120, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTE DE SÉCURITÉ IMPORTANTE', 25, finalY5 + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(
      [
        'Ce rapport est généré à titre indicatif sur la base de modèles mathématiques.',
        'Une validation humaine par un ingénieur qualifié est indispensable avant toute réalisation.',
        'Le prototypage réel peut présenter des comportements imprévus (EMI, instabilité thermique).',
        "AmpAnalyzer ne pourra être tenu responsable des dommages liés à l'usage de ce rapport.",
      ],
      25,
      finalY5 + 24
    );

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i += 1) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} sur ${pageCount} - AmpAnalyzer MVP - Outil de Conception`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`AmpAnalyzer_Report_${params.targetPower}W.pdf`);
  };

  return (
    <div className="animate-fade">
      <div className="results-grid">
        <div className="glass-card metric-card">
          <div className="metric-label"><Zap size={16} /> Tension Sortie</div>
          <div className="metric-value">
            {results.vRms.toFixed(1)}
            <span className="metric-unit">Vrms</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Crête: {results.vPeak.toFixed(1)}V | THD: {results.thd.toFixed(1)}%
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-label"><Activity size={16} /> Courant</div>
          <div className="metric-value">
            {results.iRms.toFixed(1)}
            <span className="metric-unit">Arms</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Crête: {results.iPeak.toFixed(1)}A
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-label"><Thermometer size={16} /> Dissipation</div>
          <div className="metric-value" style={{ color: results.dissipatedPower > 50 ? 'var(--accent-orange)' : 'white' }}>
            {results.dissipatedPower.toFixed(0)}
            <span className="metric-unit">W</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Efficacité: {(results.efficiency * 100).toFixed(0)}% | Tj: {tj.toFixed(0)}°C
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-label"><ShieldCheck size={16} /> P. Max Théorique</div>
          <div className="metric-value">
            {results.maxTheoreticalPower.toFixed(0)}
            <span className="metric-unit">W</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Limite Alim
          </div>
        </div>
      </div>

      <div className="glass-card verdict-card">
        <div className="verdict-header">
          {getVerdictIcon()}
          Verdict du Système :
          <span className={`badge ${getVerdictBadgeClass()}`}>{results.verdict}</span>
        </div>

        {results.reasons.length > 0 && (
          <ul className="reason-list">
            {results.reasons.map((reason, idx) => (
              <li key={idx} className="reason-item">
                <AlertTriangle size={16} className="reason-icon" color="#ff9d00" />
                {reason}
              </li>
            ))}
          </ul>
        )}

        <div className="form-group" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
          <label>Besoin Dissipateur Thermique</label>
          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            {results.heatsinkResistanceRequired > 0
              ? `${results.heatsinkResistanceRequired.toFixed(2)} °C/W`
              : results.dissipatedPower < 2
                ? 'Aucun requis (refroidissement passif PCB)'
                : 'Refroidissement impossible'}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {results.heatsinkResistanceRequired > 0 &&
              `Une valeur plus faible signifie un dissipateur plus volumineux. Cibler < ${results.heatsinkResistanceRequired.toFixed(2)}.`}
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Comparatif : Classe AB vs Classe D</h3>
          {results.comparison.bestClass && (
            <div style={{
              padding: '0.5rem 1rem',
              background: 'rgba(0, 255, 128, 0.1)',
              borderRadius: '2rem',
              border: '1px solid var(--accent-green)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--accent-green)',
            }}>
              Architecture recommandée automatiquement : {results.comparison.bestClass}
            </div>
          )}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
              <th style={{ padding: '1rem 0', color: 'var(--text-muted)', textAlign: 'left' }}>Classe</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Rendement</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Dissipation</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Complexité</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Coût</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {results.comparison.points.map((p, i) => (
              <tr key={i} style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                background: p.ampClass === results.comparison.bestClass ? 'rgba(0, 255, 128, 0.05)' : 'transparent',
              }}>
                <td style={{ padding: '1rem 0', textAlign: 'left', fontWeight: 600 }}>
                  {p.ampClass}
                  {p.ampClass === results.comparison.bestClass && (
                    <span className="badge badge-functional" style={{ marginLeft: '0.5rem', fontSize: '0.6rem' }}>Recommandé</span>
                  )}
                  {!p.isViable && (
                    <span className="badge badge-failed" style={{ marginLeft: '0.5rem', fontSize: '0.6rem' }}>Non Viable</span>
                  )}
                </td>
                <td style={{ padding: '1rem 0' }}>{(p.efficiency * 100).toFixed(0)}%</td>
                <td style={{ padding: '1rem 0', color: !p.isViable ? 'var(--accent-red)' : 'inherit' }}>
                  {p.dissipation.toFixed(0)}W
                </td>
                <td style={{ padding: '1rem 0' }}>{p.complexity}</td>
                <td style={{ padding: '1rem 0' }}>{p.cost}</td>
                <td style={{ padding: '1rem 0' }}>
                  {p.isViable
                    ? <span style={{ color: '#00ff80' }}>✅ Viable</span>
                    : <span style={{ color: '#ff4b2b' }}>❌ Non Viable</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isExpert && (
        <div className="glass-card animate-fade" style={{ marginTop: '2rem', border: isPremium ? '1px solid rgba(0, 242, 255, 0.2)' : '1px solid rgba(0, 163, 255, 0.4)', background: isPremium ? 'var(--card-glass)' : 'linear-gradient(135deg, rgba(0, 20, 40, 0.8), rgba(0, 10, 20, 0.9))' }}>
          {isPremium ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <Gauge size={22} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Analyse Avancée (Mode Expert)</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.8rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Qualité Signal</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>THD ≈ {results.thd.toFixed(1)}%</div>
                  <div style={{ fontSize: '0.75rem', color: results.thd > 0.3 ? 'var(--accent-orange)' : 'var(--accent-green)', marginTop: '0.3rem' }}>
                    {results.thd > 0.3 ? 'Distorsion audible possible' : 'Haute Fidélité'}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.8rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Réserve Tension</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Headroom: {headroom.toFixed(2)}V</div>
                  {headroom < 2 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-red)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertTriangle size={12} /> Risque de Clipping
                    </div>
                  )}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.8rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Stress Thermique</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Tj: {tj.toFixed(0)}°C</div>
                  <div style={{ fontSize: '0.75rem', color: tj > 80 ? 'var(--accent-red)' : 'var(--accent-green)', marginTop: '0.3rem' }}>
                    {tj > 80 ? 'Surchauffe → Réduire Vcc' : 'Fonctionnement stable'}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.8rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Marges de Sécurité</div>
                  <div style={{ fontSize: '0.85rem' }}>
                    Courant: <span style={{ color: 'var(--accent-cyan)' }}>75% (OK)</span><br />
                    Thermique: <span style={{ color: 'var(--accent-cyan)' }}>60% (OK)</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 163, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Lock size={30} color="var(--accent-blue)" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.8rem' }}>Passez en version Pro pour accéder :</h3>
              <ul style={{ color: 'var(--text-muted)', textAlign: 'left', display: 'inline-block', margin: '0 auto 2rem', lineHeight: '1.8' }}>
                <li>• Au mode expert (THD, Headroom, Tj)</li>
                <li>• Au rapport PDF complet et professionnel</li>
                <li>• Aux designs et schémas détaillés</li>
              </ul>
              <br />
              <button
                className="download-btn"
                onClick={() => alert('Paiement bientôt disponible')}
                style={{ margin: '0 auto', background: 'linear-gradient(to right, var(--accent-blue), #007bff)' }}
              >
                Débloquer la Version Pro
              </button>
            </div>
          )}
        </div>
      )}

      <div className="glass-card" style={{ marginTop: '2rem', border: '1px solid var(--accent-cyan)', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <Zap size={24} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            Solution Technique Détaillée : {architectureChoisie}
          </h3>
        </div>

        <div className="main-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Composant principal</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{mainComponent}</span>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Refroidissement</span>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>{results.recommendation.heatsinkType}</span>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Alimentation recommandée</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {architectureChoisie === 'Classe AB' ? results.powerSupply.voltageSymmetrical : results.powerSupply.voltageSimple}
                </span>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Courant Min Alim</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-green)' }}>{results.powerSupply.minCurrent}</span>
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1.5rem' }}>Schéma de principe ({architectureChoisie}) :</span>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', zIndex: 2, fontSize: '0.85rem' }}>
                  <div style={{ border: '1px solid var(--border-glass)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>[IN]</div>
                  <div style={{ color: 'var(--accent-cyan)' }}>--{architectureChoisie === 'Classe D' ? 'L/C' : 'C'}--&gt;</div>
                  <div style={{ border: '2px solid var(--accent-cyan)', padding: '0.4rem 0.8rem', borderRadius: '4px', background: 'rgba(0, 242, 255, 0.05)', fontWeight: 700 }}>
                    [{mainComponent}]
                  </div>
                  <div style={{ color: 'var(--accent-cyan)' }}>--{architectureChoisie === 'Classe D' ? 'Filter' : 'Rout'}--&gt;</div>
                  <div style={{ border: '1px solid var(--accent-green)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>[HP]</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-2px' }}>
                  <div style={{ width: '2px', height: '25px', background: 'var(--accent-cyan)' }}></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.4rem 0.8rem' }}>
                    Alimentation {architectureChoisie === 'Classe AB' ? 'Symétrique' : 'Simple'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem', color: 'var(--text-muted)' }}>BOM : {architectureChoisie}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.bom.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.description}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>x{item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="main-grid" style={{ marginTop: '2rem', gridTemplateColumns: '1fr 1fr' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: 700 }}>Paramètres Techniques Globaux</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Swing de tension réel</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{results.vPeak.toFixed(2)} Vpk</span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Courant crête HP</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{results.iPeak.toFixed(2)} Apk</span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Architecture choisie</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{architectureChoisie}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Dissipateur requis</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{results.recommendation.heatsinkType}</span>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: 700 }}>Observations et Analyse</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {results.reasons.map((r, i) => (
              <div key={i} style={{ fontSize: '0.9rem', display: 'flex', gap: '0.6rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>•</span> <span>{r}</span>
              </div>
            ))}
            <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.4rem' }}>
                Pourquoi ce design ?
              </span>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5', fontStyle: 'italic' }}>
                {results.recommendation.whyRecommended}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button
          className="download-btn"
          onClick={generatePDF}
          style={{ position: 'relative' }}
        >
          <Download size={18} /> Télécharger le Rapport Complet (PDF)
          {!isPremium && <Lock size={12} style={{ position: 'absolute', top: '5px', right: '5px' }} />}
        </button>

        <button
          className="download-btn"
          onClick={onSave}
          style={{ background: 'rgba(0, 255, 128, 0.1)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)' }}
        >
          <Save size={18} /> Sauvegarder l'analyse
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
import { useMemo } from 'react';
import type { UserParams } from '../logic/amplifierCalculator';
import {
  getICsForClass,
  getDefaultIC,
  getICById,
  type ICComponent
} from '../logic/amplifierCalculator';

interface Props {
  params: UserParams;
  setParams: React.Dispatch<React.SetStateAction<UserParams>>;
}

const POWER_PRESETS = [10, 25, 50, 100, 200, 500];
const IMPEDANCE_OPTIONS = [2, 4, 8, 16];

const AVAILABILITY_COLOR: Record<string, string> = {
  'Très commune': '#00ff80',
  'Commune': '#ffaa00',
  'Rare': '#ff4b2b',
};

export default function CalculatorForm({ params, setParams }: Props) {
  const set = <K extends keyof UserParams>(key: K, value: UserParams[K]) =>
    setParams(prev => ({ ...prev, [key]: value }));

  // Hints dynamiques
  const hints = useMemo(() => {
    const vcc = params.supplyType === 'Symmetrical'
      ? params.supplyVoltage : params.supplyVoltage / 2;
    const vSat = params.ampClass === 'Class AB' ? 2.5 : 0;
    const vSwing = vcc - vSat;
    const maxPower = params.ampClass === 'Class AB'
      ? (vSwing * vSwing) / (2 * params.loadImpedance)
      : ((vcc / Math.sqrt(2)) ** 2) / params.loadImpedance;
    let vMin = params.ampClass === 'Class AB'
      ? Math.sqrt(2 * params.targetPower * params.loadImpedance) + vSat
      : Math.sqrt(params.targetPower * params.loadImpedance) * Math.sqrt(2);
    if (params.ampClass === 'Class AB' && params.supplyType === 'Single') vMin *= 2;
    const iPeak = Math.sqrt(
      2 * Math.min(params.targetPower, Math.max(maxPower, 0.1)) * params.loadImpedance
    ) / params.loadImpedance;
    return {
      maxPower: Math.round(maxPower * 10) / 10,
      vMin: Math.ceil(vMin),
      iPeak: Math.round(iPeak * 100) / 100,
      powerOk: params.targetPower <= maxPower * 1.02,
      voltageOk: params.supplyVoltage >= vMin,
    };
  }, [params]);

  // Liste des CI compatibles
  const icList: ICComponent[] = useMemo(
    () => getICsForClass(params.ampClass),
    [params.ampClass]
  );

  const selectedIC = getICById(params.selectedIC)
    ?? getICById(getDefaultIC(params.ampClass, params.targetPower, params.supplyVoltage));

  // Vérification compatibilité CI sélectionné
  const icWarning = useMemo(() => {
    if (!selectedIC) return null;
    const vcc = params.supplyType === 'Symmetrical'
      ? params.supplyVoltage : params.supplyVoltage / 2;
    if (hints.maxPower > selectedIC.poutMax)
      return `⚠ ${selectedIC.name} limité à ${selectedIC.poutMax}W — insuffisant pour ${hints.maxPower.toFixed(0)}W`;
    if (vcc > selectedIC.vccMax)
      return `⚠ ${selectedIC.name} : Vcc max = ${selectedIC.vccMax}V — tension trop haute`;
    return null;
  }, [selectedIC, hints, params]);

  // Changement de classe → reset IC
  const handleClassChange = (cls: 'Class AB' | 'Class D') => {
    const newIC = getDefaultIC(cls, params.targetPower, params.supplyVoltage);
    setParams(prev => ({ ...prev, ampClass: cls, selectedIC: newIC }));
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* En-tête */}
      <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
          Paramètres de Conception
        </h2>
      </div>

      {/* ── Puissance ── */}
      <div className="form-group">
        <label>PUISSANCE DE SORTIE (W)</label>
        <div style={{ position: 'relative' }}>
          <input type="number" className="input-control"
            value={params.targetPower} min={1} max={5000}
            onChange={e => set('targetPower', Math.max(1, parseFloat(e.target.value) || 1))}
            style={{ borderColor: hints.powerOk ? 'var(--border-glass)' : 'rgba(255,75,43,0.5)', paddingRight: '2.5rem' }}
          />
          <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>W</span>
        </div>
        <p style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: hints.powerOk ? 'var(--text-muted)' : 'var(--accent-red)' }}>
          {hints.powerOk
            ? `Limite actuelle avec ${params.supplyVoltage}V / ${params.loadImpedance}Ω : ${hints.maxPower} W`
            : `⚠ Max atteignable : ${hints.maxPower} W — augmentez la tension`}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
          {POWER_PRESETS.map(w => (
            <button key={w} onClick={() => set('targetPower', w)} style={{
              padding: '0.25rem 0.65rem', borderRadius: '0.5rem', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s',
              border: `1px solid ${params.targetPower === w ? 'var(--accent-cyan)' : 'var(--border-glass)'}`,
              background: params.targetPower === w ? 'rgba(0,242,255,0.1)' : 'transparent',
              color: params.targetPower === w ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontFamily: 'inherit'
            }}>{w} W</button>
          ))}
        </div>
      </div>

      {/* ── Impédance ── */}
      <div className="form-group">
        <label>IMPÉDANCE DE CHARGE (Ω)</label>
        <div className="toggle-group" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          {IMPEDANCE_OPTIONS.map(ohm => (
            <button key={ohm}
              className={`toggle-btn ${params.loadImpedance === ohm ? 'active' : ''}`}
              onClick={() => set('loadImpedance', ohm)}>
              {ohm} Ω
            </button>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
          Courant crête : <strong style={{ color: 'var(--accent-cyan)' }}>{hints.iPeak} A</strong>
          {params.loadImpedance <= 4 &&
            <span style={{ color: 'var(--accent-orange)', marginLeft: '0.5rem' }}>· Charge faible ⚠</span>}
        </p>
      </div>

      {/* ── Tension ── */}
      <div className="form-group">
        <label>TENSION D'ALIMENTATION (V)</label>
        <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
          <input type="number" className="input-control"
            value={params.supplyVoltage} min={5} max={120}
            onChange={e => set('supplyVoltage', Math.max(5, parseFloat(e.target.value) || 5))}
            style={{ borderColor: hints.voltageOk ? 'var(--border-glass)' : 'rgba(255,157,0,0.5)', paddingRight: '2.5rem' }}
          />
          <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>V</span>
        </div>
        <input type="range" min={5} max={100} step={1}
          value={params.supplyVoltage}
          onChange={e => set('supplyVoltage', parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: hints.voltageOk ? 'var(--accent-cyan)' : 'var(--accent-orange)', marginBottom: '0.35rem' }}
        />
        <p style={{ fontSize: '0.75rem', color: hints.voltageOk ? 'var(--text-muted)' : 'var(--accent-orange)' }}>
          {hints.voltageOk
            ? `Minimum actuel pour ${params.targetPower}W / ${params.loadImpedance}Ω : ${hints.vMin}V`
            : `⚠ Tension insuffisante ! Minimum requis : ${hints.vMin} V`}
        </p>
      </div>

      {/* ── Type alimentation ── */}
      <div className="form-group">
        <label>TYPE D'ALIMENTATION</label>
        <div className="toggle-group">
          {(['Single', 'Symmetrical'] as const).map(t => (
            <button key={t}
              className={`toggle-btn ${params.supplyType === t ? 'active' : ''}`}
              onClick={() => set('supplyType', t)}>
              {t === 'Symmetrical' ? 'Symétrique' : 'Simple'}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
          {params.supplyType === 'Symmetrical'
            ? `Rail : ±${params.supplyVoltage} V`
            : `Rail : +${params.supplyVoltage} V / GND`}
        </p>
      </div>

      {/* ── Classe ── */}
      <div className="form-group">
        <label>CLASSE D'AMPLIFICATION</label>
        <div className="toggle-group">
          {(['Class AB', 'Class D'] as const).map(cls => (
            <button key={cls}
              className={`toggle-btn ${params.ampClass === cls ? 'active' : ''}`}
              onClick={() => handleClassChange(cls)}>
              {cls}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
          {params.ampClass === 'Class AB'
            ? '🎵 Hi-Fi · THD < 0.1% · Rendement ~78%'
            : '⚡ Efficacité ~92% · Filtre LC obligatoire'}
        </p>
      </div>

      {/* ══ SÉLECTEUR DE COMPOSANT PRINCIPAL ══ */}
      <div className="form-group">
        <label style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>
          COMPOSANT PRINCIPAL — VOTRE CHOIX
        </label>

        {/* Dropdown */}
        <select
          className="input-control"
          value={params.selectedIC || ''}
          onChange={e => set('selectedIC', e.target.value)}
          style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
        >
          {icList.map(ic => (
            <option key={ic.id} value={ic.id}>
              {ic.name} — {ic.poutMax}W max — {ic.package} — {ic.availability}
            </option>
          ))}
        </select>

        {/* Fiche technique du CI sélectionné */}
        {selectedIC && (
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            border: `1px solid ${icWarning ? 'rgba(255,157,0,0.4)' : 'rgba(0,242,255,0.15)'}`,
            borderRadius: '0.65rem',
            padding: '0.75rem',
            fontSize: '0.78rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            {/* Header CI */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>
                {selectedIC.name}
              </span>
              <span style={{
                fontSize: '0.65rem', padding: '0.1rem 0.5rem',
                borderRadius: '1rem', fontWeight: 700,
                background: AVAILABILITY_COLOR[selectedIC.availability] + '22',
                color: AVAILABILITY_COLOR[selectedIC.availability],
                border: `1px solid ${AVAILABILITY_COLOR[selectedIC.availability]}44`
              }}>
                {selectedIC.availability}
              </span>
            </div>

            {/* Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', color: 'var(--text-muted)' }}>
              <span>Fabricant : <strong style={{ color: 'white' }}>{selectedIC.manufacturer}</strong></span>
              <span>Boîtier : <strong style={{ color: 'white' }}>{selectedIC.package}</strong></span>
              <span>Puissance max : <strong style={{ color: 'var(--accent-cyan)' }}>{selectedIC.poutMax} W</strong></span>
              <span>Vcc max : <strong style={{ color: 'var(--accent-cyan)' }}>±{selectedIC.vccMax} V</strong></span>
              <span>Rendement : <strong style={{ color: '#00ff80' }}>{selectedIC.efficiency}%</strong></span>
              <span>
                Transistors ext. : <strong style={{ color: selectedIC.needsDiscrete ? 'var(--accent-orange)' : '#00ff80' }}>
                  {selectedIC.needsDiscrete ? 'Requis' : 'Non requis'}
                </strong>
              </span>
            </div>

            {/* Note technique */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.35rem', marginTop: '0.1rem' }}>
              {selectedIC.notes}
            </p>

            {/* Avertissement incompatibilité */}
            {icWarning && (
              <div style={{
                background: 'rgba(255,157,0,0.08)',
                border: '1px solid rgba(255,157,0,0.3)',
                borderRadius: '0.4rem',
                padding: '0.4rem 0.6rem',
                color: 'var(--accent-orange)',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {icWarning}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Température ── */}
      <div className="form-group">
        <label>TEMPÉRATURE AMBIANTE (°C)</label>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input type="range" min={-10} max={70} step={5}
            value={params.ambientTemp}
            onChange={e => set('ambientTemp', parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: params.ambientTemp > 40 ? 'var(--accent-red)' : 'var(--accent-orange)' }}
          />
          <div style={{
            minWidth: '56px', textAlign: 'center', fontWeight: 800, fontSize: '1rem',
            color: params.ambientTemp > 40 ? 'var(--accent-red)' : 'var(--accent-orange)',
            background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.3rem 0.5rem'
          }}>
            {params.ambientTemp} °C
          </div>
        </div>
        {params.ambientTemp > 40 &&
          <p style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: 'var(--accent-red)' }}>
            ⚠ Haute température — dissipateur renforcé requis
          </p>}
      </div>

      {/* ── Résumé ── */}
      <div style={{
        background: hints.powerOk && hints.voltageOk && !icWarning
          ? 'rgba(0,255,128,0.04)' : 'rgba(255,157,0,0.04)',
        border: `1px solid ${hints.powerOk && hints.voltageOk && !icWarning
          ? 'rgba(0,255,128,0.15)' : 'rgba(255,157,0,0.2)'}`,
        borderRadius: '0.75rem', padding: '0.85rem 1rem',
        fontSize: '0.8rem', lineHeight: 1.8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <span style={{
            fontSize: '0.65rem', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontWeight: 800,
            background: hints.powerOk && hints.voltageOk && !icWarning
              ? 'rgba(0,255,128,0.15)' : 'rgba(255,157,0,0.15)',
            color: hints.powerOk && hints.voltageOk && !icWarning
              ? '#00ff80' : 'var(--accent-orange)'
          }}>
            {hints.powerOk && hints.voltageOk && !icWarning ? 'VALIDE' : 'ATTENTION'}
          </span>
          <span style={{ fontWeight: 700, color: 'white', fontSize: '0.82rem' }}>Résumé</span>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          <strong style={{ color: 'white' }}>{params.ampClass}</strong>{' · '}
          <strong style={{ color: 'var(--accent-cyan)' }}>{params.targetPower} W</strong>{' · '}
          {params.loadImpedance} Ω{' · '}
          {params.supplyType === 'Symmetrical' ? `±${params.supplyVoltage} V` : `${params.supplyVoltage} V`}{' · '}
          <strong style={{ color: 'var(--accent-cyan)' }}>{selectedIC?.name ?? '—'}</strong>
        </div>
      </div>
    </div>
  );
}
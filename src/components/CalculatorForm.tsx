import React from 'react';
import type { UserParams, SupplyType, AmplifierClass } from '../logic/amplifierCalculator';

interface CalculatorFormProps {
  params: UserParams;
  setParams: (params: UserParams) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ params, setParams }) => {








  const setSupplyType = (type: SupplyType) => setParams({ ...params, supplyType: type });
  const setAmpClass = (cls: AmplifierClass) => setParams({ ...params, ampClass: cls });

  return (
    <div className="glass-card animate-fade" style={{ height: 'fit-content' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 700 }}>Paramètres de Conception</h3>

      <div className="form-group">
        <label>Puissance de sortie (W)</label>
        <input
          type="number"
          name="targetPower"
          value={params.targetPower}
          onChange={(e) => {
            const value = e.target.value;

            if (value.trim() === "") {
              return;
            }

            const nextValue = Number(value);

            if (!Number.isFinite(nextValue)) {
              return;
            }

            setParams({
              ...params,
              targetPower: nextValue,
            });
          }}
          className="input-control"
          min="1"
        />
      </div>

      <div className="form-group">
        <label>Impédance de charge (Ω)</label>
        <div className="toggle-group" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[2, 4, 8, 16].map(z => (
            <button
              key={z}
              className={`toggle-btn ${params.loadImpedance === z ? 'active' : ''}`}
              onClick={() => setParams({ ...params, loadImpedance: z })}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Tension d'alimentation (V)</label>
        <input
          type="number"
          name="supplyVoltage"
          value={params.supplyVoltage}
          onChange={(e) => {
            const value = e.target.value;

            if (value.trim() === "") {
              return;
            }

            const nextValue = Number(value);

            if (!Number.isFinite(nextValue)) {
              return;
            }

            setParams({
              ...params,
              supplyVoltage: nextValue,
            });
          }}
          className="input-control"
          min="1"
        />
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {params.supplyType === 'Symmetrical' ? 'Tension par rail (+/- Vcc)' : 'Tension totale'}
        </p>
      </div>

      <div className="form-group">
        <label>Type d'alimentation</label>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${params.supplyType === 'Simple' ? 'active' : ''}`}
            onClick={() => setSupplyType('Simple')}
          >
            Simple
          </button>
          <button
            className={`toggle-btn ${params.supplyType === 'Symmetrical' ? 'active' : ''}`}
            onClick={() => setSupplyType('Symmetrical')}
          >
            Symétrique
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Classe d'amplification</label>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${params.ampClass === 'Class AB' ? 'active' : ''}`}
            onClick={() => setAmpClass('Class AB')}
          >
            Class AB
          </button>
          <button
            className={`toggle-btn ${params.ampClass === 'Class D' ? 'active' : ''}`}
            onClick={() => setAmpClass('Class D')}
          >
            Class D
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Température Ambiante (°C)</label>
        <input
          type="number"
          name="ambientTemp"
          value={params.ambientTemp}
          onChange={(e) => {
            const value = e.target.value;

            if (value.trim() === "") {
              return;
            }

            const nextValue = Number(value);

            if (!Number.isFinite(nextValue)) {
              return;
            }

            setParams({
              ...params,
              ambientTemp: nextValue,
            });
          }}
          className="input-control"
        />
      </div>
    </div>
  );
};

export default CalculatorForm;

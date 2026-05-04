import React from 'react';
import type { UserParams, SupplyType, AmplifierClass } from '../logic/amplifierCalculator';

interface CalculatorFormProps {
  params: UserParams;
  setParams: (params: UserParams) => void;
}

const clamp = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

const requiredVoltageForPower = (power: number, impedance: number) => {
  return Math.ceil(Math.sqrt(power * impedance) * Math.SQRT2 * 1.15);
};

const maxPowerForVoltage = (voltage: number, impedance: number) => {
  return Math.floor(((voltage / 1.15) / Math.SQRT2) ** 2 / impedance);
};

const CalculatorForm: React.FC<CalculatorFormProps> = ({ params, setParams }) => {
  const voltageMin = Math.max(5, requiredVoltageForPower(params.targetPower, params.loadImpedance));
  const powerMax = Math.min(100, Math.max(1, maxPowerForVoltage(params.supplyVoltage, params.loadImpedance)));

  const setSupplyType = (type: SupplyType) => setParams({ ...params, supplyType: type });
  const setAmpClass = (cls: AmplifierClass) => setParams({ ...params, ampClass: cls });

  return (
    <div className="glass-card animate-fade" style={{ height: 'fit-content' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 700 }}>
        Paramètres de Conception
      </h3>

      <div className="form-group">
        <label>Puissance de sortie (W)</label>
        <input
          type="number"
          name="targetPower"
          value={params.targetPower}
          onChange={(e) => {
            const value = clamp(Number(e.target.value), 1, powerMax);
            setParams({ ...params, targetPower: value });
          }}
          className="input-control"
          min={1}
          max={powerMax}
        />
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Limite actuelle avec {params.supplyVoltage}V / {params.loadImpedance}Ω : {powerMax}W
        </p>
      </div>

      <div className="form-group">
        <label>Impédance de charge (Ω)</label>
        <div className="toggle-group" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[2, 4, 8, 16].map((z) => (
            <button
              key={z}
              className={`toggle-btn ${params.loadImpedance === z ? 'active' : ''}`}
              onClick={() => {
                const nextPowerMax = Math.min(100, Math.max(1, maxPowerForVoltage(params.supplyVoltage, z)));
                setParams({
                  ...params,
                  loadImpedance: z,
                  targetPower: clamp(params.targetPower, 1, nextPowerMax),
                });
              }}
              type="button"
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
            const value = clamp(Number(e.target.value), voltageMin, 35);
            setParams({ ...params, supplyVoltage: value });
          }}
          className="input-control"
          min={voltageMin}
          max={35}
        />
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Minimum actuel pour {params.targetPower}W / {params.loadImpedance}Ω : {voltageMin}V
        </p>
      </div>

      <div className="form-group">
        <label>Type d'alimentation</label>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${params.supplyType === 'Simple' ? 'active' : ''}`}
            onClick={() => setSupplyType('Simple')}
            type="button"
          >
            Simple
          </button>
          <button
            className={`toggle-btn ${params.supplyType === 'Symmetrical' ? 'active' : ''}`}
            onClick={() => setSupplyType('Symmetrical')}
            type="button"
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
            type="button"
          >
            Class AB
          </button>
          <button
            className={`toggle-btn ${params.ampClass === 'Class D' ? 'active' : ''}`}
            onClick={() => setAmpClass('Class D')}
            type="button"
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
            const value = clamp(Number(e.target.value), 0, 80);
            setParams({ ...params, ambientTemp: value });
          }}
          className="input-control"
          min={0}
          max={80}
        />
      </div>
    </div>
  );
};

export default CalculatorForm;
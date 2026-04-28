import { useState, useMemo, useEffect } from 'react';
import { calculateAmplifier } from './logic/amplifierCalculator';
import type { CalculationResults, UserParams, Analysis } from './logic/amplifierCalculator';
import CalculatorForm from './components/CalculatorForm';
import ResultsDashboard from './components/ResultsDashboard';

import { Cpu, ShieldAlert, FileText, ArrowRight, RotateCcw, Trash2, Eye, Home, Gauge, ShieldCheck } from 'lucide-react';

function App() {
  const isPremium = false; // Flag pour fonctionnalités avancées
  const [screen, setScreen] = useState<'home' | 'analyzer'>('home');
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [params, setParams] = useState<UserParams>({
    targetPower: 50,
    loadImpedance: 8,
    supplyVoltage: 35,
    supplyType: 'Symmetrical',
    ampClass: 'Class AB',
    ambientTemp: 25
  });

  const [analysisData, setAnalysisData] = useState<CalculationResults | null>(null);
  const [history, setHistory] = useState<Analysis[]>([]);

  useEffect(() => {
    setAnalysisData(calculateAmplifier(params));
    const saved = JSON.parse(localStorage.getItem("analyses") || "[]");
    setHistory(saved);
  }, [params]);

  const saveAnalysis = (data: Analysis) => {
    const existing = JSON.parse(localStorage.getItem("analyses") || "[]");
    const updated = [data, ...existing]; 
    localStorage.setItem("analyses", JSON.stringify(updated));
    setHistory(updated);
    alert("Analyse sauvegardée avec succès !");
  };

  const clearHistory = () => {
    if (confirm("Effacer tout l'historique ?")) {
      localStorage.removeItem("analyses");
      setHistory([]);
    }
  };

  const deleteAnalysis = (id: string) => {
    const updated = history.filter(a => a.id !== id);
    localStorage.setItem("analyses", JSON.stringify(updated));
    setHistory(updated);
  };

  if (screen === 'home') {
    return (
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '2rem' }}>
        <div className="glass-card animate-fade" style={{ maxWidth: '800px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AmpAnalyzer
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            Assistant de préconception d’amplificateurs audio
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '0.8rem', background: 'rgba(0, 242, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={20} color="var(--accent-cyan)" />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Calculs Automatiques</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '0.8rem', background: 'rgba(255, 75, 43, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldAlert size={20} color="var(--accent-red)" />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Détection d'Erreurs</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '0.8rem', background: 'rgba(0, 255, 128, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} color="#00ff80" />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Rapports PDF</span>
            </div>
          </div>

          <button 
            className="download-btn" 
            style={{ margin: '0 auto', padding: '1rem 3rem', fontSize: '1.1rem' }}
            onClick={() => setScreen('analyzer')}
          >
            Démarrer une nouvelle analyse <ArrowRight size={20} />
          </button>
        </div>

        {history.length > 0 && (
          <div className="glass-card animate-fade" style={{ maxWidth: '800px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Historique des Analyses</h3>
              <button 
                onClick={clearHistory}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
              >
                Effacer l'historique
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {history.map((a) => (
                  <div 
                    key={a.id} 
                    onClick={() => {
                      setParams(prev => ({
                        ...prev,
                        targetPower: a.power,
                        loadImpedance: a.impedance,
                        supplyVoltage: a.vcc,
                        ampClass: a.architecture.includes('Classe D') ? 'Class D' : 'Class AB'
                      }));
                      setScreen('analyzer');
                    }}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '1rem', 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '0.8rem',
                      border: '1px solid rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Eye size={16} /> Voir
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{a.power}W</div>
                    <div style={{ color: 'var(--text-muted)' }}>{a.impedance}Ω</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{a.date}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      background: a.verdict === 'Functional' ? 'rgba(0, 255, 128, 0.1)' : 'rgba(255, 75, 43, 0.1)',
                      color: a.verdict === 'Functional' ? 'var(--accent-green)' : 'var(--accent-red)'
                    }}>
                      {a.verdict}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAnalysis(a.id);
                      }}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'rgba(255,255,255,0.2)', 
                        cursor: 'pointer',
                        padding: '0.4rem',
                        borderRadius: '0.4rem',
                        transition: 'color 0.2s, background 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--accent-red)';
                        e.currentTarget.style.background = 'rgba(255, 75, 43, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.2)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container" style={{ padding: '2rem' }}>
      <header className="header animate-fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', marginBottom: '2rem' }}>
        <div>
          <h1>AmpAnalyzer</h1>
          <p>Outil d'Analyse et de Conception</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            cursor: 'pointer', 
            fontSize: '0.9rem', 
            color: 'var(--text-muted)'
          }}>
            <input 
              type="checkbox" 
              checked={isExpertMode} 
              onChange={(e) => setIsExpertMode(e.target.checked)}
            />
            {isPremium ? <Gauge size={16} /> : <ShieldCheck size={16} color="var(--accent-blue)" />} 
            Mode Expert
            {!isPremium && <span style={{ marginLeft: '0.3rem', fontSize: '0.6rem', padding: '0.1rem 0.4rem', background: 'var(--accent-blue)', color: 'white', borderRadius: '0.4rem', fontWeight: 800 }}>PRO</span>}
          </label>
          <button 
            onClick={() => setScreen('home')}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
          >
            <Home size={16} /> Accueil
          </button>
        </div>
      </header>

      <main className="main-grid">
        <section>
          <CalculatorForm params={params} setParams={setParams} />
        </section>
        
        <section>
          {analysisData && (
            <ResultsDashboard 
              results={analysisData} 
              params={params} 
              isExpert={isExpertMode}
              isPremium={isPremium}
              onSave={() => saveAnalysis({
                id: crypto.randomUUID(),
                date: new Date().toLocaleDateString(),
                power: params.targetPower,
                impedance: params.loadImpedance,
                vcc: params.supplyVoltage,
                architecture: params.ampClass === 'Class D' ? 'Classe D' : 'Classe AB',
                verdict: analysisData.recommendation.warnings.length === 0 ? 'Functional' : 'Warning'
              })} 
            />
          )}
        </section>
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <p>&copy; 2024 AmpAnalyzer MVP</p>
      </footer>
    </div>
  );
}

export default App;

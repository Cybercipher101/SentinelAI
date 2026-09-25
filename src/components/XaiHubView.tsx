import React, { useState } from 'react';
import { BENCHMARK_METRICS } from '../data/researchData';
import { 
  Sparkles, 
  Eye, 
  EyeOff, 
  Award, 
  Binary, 
  GlobeLock, 
  MailWarning, 
  Activity, 
  HelpCircle,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';

export const XaiHubView: React.FC = () => {
  const [isBlackBoxMode, setIsBlackBoxMode] = useState<boolean>(false);
  const [selectedVector, setSelectedVector] = useState<'Malware' | 'URL' | 'Email' | 'Network'>('Malware');

  const shapBreakdowns = {
    Malware: [
      { feature: 'High Entropy .upx0 Section (>7.9)', value: +0.38, type: 'positive', category: 'Entropy' },
      { feature: 'Process Hollowing (VirtualAlloc+RemoteThread)', value: +0.34, type: 'positive', category: 'Behavioral' },
      { feature: 'Shadow Copy Deletion API Call', value: +0.22, type: 'positive', category: 'Behavioral' },
      { feature: 'Writable+Executable Section Headers', value: +0.16, type: 'positive', category: 'Structural' },
      { feature: 'Trusted CA Authenticode Signature', value: -0.12, type: 'negative', category: 'Structural' }
    ],
    URL: [
      { feature: 'Brand Spoofing Token (microsoft365)', value: +0.41, type: 'positive', category: 'Semantic' },
      { feature: 'Subdomain Stacking (Depth: 3)', value: +0.29, type: 'positive', category: 'Lexical' },
      { feature: 'Young Domain Age (< 4 days)', value: +0.18, type: 'positive', category: 'Structural' },
      { feature: 'Direct Binary File Extension (.bin)', value: +0.12, type: 'positive', category: 'Lexical' },
      { feature: 'Reputable Academic TLD (.edu)', value: -0.45, type: 'negative', category: 'Lexical' }
    ],
    Email: [
      { feature: 'Psychological Urgency NLP Index (>90)', value: +0.42, type: 'positive', category: 'Semantic' },
      { feature: 'SPF & DMARC Header Authentication Failure', value: +0.32, type: 'positive', category: 'Structural' },
      { feature: 'Embedded Malicious Phishing URL Link', value: +0.26, type: 'positive', category: 'Correlation' },
      { feature: 'Financial Coercion Token Weights', value: +0.15, type: 'positive', category: 'Semantic' },
      { feature: 'Verified Internal Institutional MX', value: -0.52, type: 'negative', category: 'Structural' }
    ],
    Network: [
      { feature: 'Autoencoder Reconstruction Loss (0.942 > 0.250)', value: +0.45, type: 'positive', category: 'Unsupervised' },
      { feature: 'Anomalous SYN/ACK Handshake Ratio (142:1)', value: +0.35, type: 'positive', category: 'Temporal' },
      { feature: 'Sustained Burst Flow Volume (3.4 MB/s)', value: +0.20, type: 'positive', category: 'Temporal' },
      { feature: 'Known Tor Exit Node IP Rep', value: +0.18, type: 'positive', category: 'Reputation' },
      { feature: 'Baseline Flow Symmetry Conformity', value: -0.40, type: 'negative', category: 'Temporal' }
    ]
  };

  const currentShapList = shapBreakdowns[selectedVector];

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-600/30 border border-cyan-500/40 text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Explainable AI (XAI) & Model Transparency Hub</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded">
                  SHAP / LIME Framework
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Resolving the "Accuracy-Explainability Trilemma" (Synopsis Sec 1.2, 3.2 & Ref [13])
              </p>
            </div>
          </div>

          {/* Black Box vs XAI Toggle */}
          <div className="flex items-center gap-3 bg-cyber-900 p-1.5 rounded-lg border border-cyber-border">
            <button
              onClick={() => setIsBlackBoxMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all ${
                isBlackBoxMode
                  ? 'bg-red-950 text-red-300 border border-red-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Opaque Black Box</span>
            </button>

            <button
              onClick={() => setIsBlackBoxMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                !isBlackBoxMode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>XAI Transparency (SHAP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Black Box vs XAI Interactive Showcase */}
      {isBlackBoxMode ? (
        <div className="bg-red-950/20 border border-red-500/40 rounded-xl p-8 text-center shadow-lg">
          <div className="inline-flex p-3 rounded-full bg-red-950 text-red-400 mb-3 border border-red-500/30">
            <EyeOff className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-red-400 mb-2 font-mono">Traditional Black-Box AI Output</h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-4">
            Legacy deep learning systems output an opaque probability score without feature justification. Analysts suffer from alert fatigue and cannot verify why the threat was flagged.
          </p>
          <div className="inline-block bg-cyber-950 border border-red-500/50 rounded-lg p-4 font-mono text-left max-w-md">
            <div className="text-xs text-slate-500">RAW CLASSIFIER OUTPUT:</div>
            <div className="text-lg font-bold text-red-400">{"{ 'verdict': 'MALICIOUS', 'confidence': 0.9842 }"}</div>
            <div className="text-[11px] text-slate-400 mt-2">
              ⚠️ Reason: [UNAVAILABLE - NEURAL WEIGHTS OPAQUE]
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Vector Selector & SHAP Waterfall */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyber-border mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-slate-100">SHAP Feature Importance Waterfall</h3>
                </div>

                {/* Vector Tabs */}
                <div className="flex items-center gap-1 font-mono text-xs">
                  {(['Malware', 'URL', 'Email', 'Network'] as const).map((vec) => (
                    <button
                      key={vec}
                      onClick={() => setSelectedVector(vec)}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        selectedVector === vec
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                          : 'bg-cyber-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {vec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Waterfall Bar Chart */}
              <div className="h-60 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentShapList} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                    <XAxis type="number" domain={[-0.6, 0.6]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis type="category" dataKey="feature" stroke="#cbd5e1" fontSize={10} tickLine={false} width={100} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                      formatter={(val: number) => [`SHAP Impact: ${val > 0 ? '+' : ''}${val}`, 'Attribution Value']}
                    />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                      {currentShapList.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-cyber-border/40">
                <span className="text-red-400 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-sm"></span> Positive SHAP (+): Increases Threat Risk
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> Negative SHAP (-): Decreases Threat Risk
                </span>
              </div>
            </div>

            {/* Mathematical XAI Rationale */}
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase mb-2">
                Mathematical Foundation: Shapley Additive exPlanations
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                SHAP allocates credit to each input feature based on cooperative game theory (Shapley values). By computing marginal contributions across all feature permutations, our system guarantees mathematical consistency and local accuracy.
              </p>
              <div className="bg-cyber-950 p-2.5 rounded font-mono text-xs text-cyan-300 border border-slate-800">
                {"f(x) = \\phi_0 + \\sum_{i=1}^{M} \\phi_i(x)"}
              </div>
            </div>

          </div>

          {/* Right Column: Model Performance on Benchmark Datasets */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-100">Empirical Benchmark Accuracy (&gt;97%)</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Synopsis Sec 6</span>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                Our multi-modal Deep Learning models were validated on established peer-reviewed cybersecurity benchmark datasets:
              </p>

              <div className="space-y-3">
                {BENCHMARK_METRICS.map((bench, idx) => (
                  <div key={idx} className="bg-cyber-900/90 p-3 rounded-lg border border-cyber-border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-100">{bench.module}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{bench.f1Score} F1</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mb-2">Dataset: {bench.dataset}</div>
                    <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-center">
                      <div className="bg-cyber-950 p-1 rounded border border-slate-800">
                        <span className="text-[9px] text-slate-500 block">ACCURACY</span>
                        <span className="text-slate-200 font-bold">{bench.accuracy}</span>
                      </div>
                      <div className="bg-cyber-950 p-1 rounded border border-slate-800">
                        <span className="text-[9px] text-slate-500 block">PRECISION</span>
                        <span className="text-slate-200 font-bold">{bench.precision}</span>
                      </div>
                      <div className="bg-cyber-950 p-1 rounded border border-slate-800">
                        <span className="text-[9px] text-slate-500 block">RECALL</span>
                        <span className="text-slate-200 font-bold">{bench.recall}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

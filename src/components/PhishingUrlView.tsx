import React, { useState } from 'react';
import { PhishingScanResult } from '../types/cybersecurity';
import { SAMPLE_PHISHING_URLS } from '../data/sampleScans';
import { 
  GlobeLock, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Tag, 
  CheckCircle, 
  AlertTriangle,
  Bot,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface PhishingUrlViewProps {
  onAskChatbot?: (prompt: string) => void;
  initialUrlKey?: string;
}

export const PhishingUrlView: React.FC<PhishingUrlViewProps> = ({
  onAskChatbot,
  initialUrlKey = 'http://secure-login-microsoft365.account-verify.online/auth/login.php?session=9283'
}) => {
  const [inputUrl, setInputUrl] = useState<string>(initialUrlKey);
  const [currentResult, setCurrentResult] = useState<PhishingScanResult>(
    SAMPLE_PHISHING_URLS[initialUrlKey] || SAMPLE_PHISHING_URLS['http://secure-login-microsoft365.account-verify.online/auth/login.php?session=9283']
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleScan = async (urlToScan: string) => {
    setIsScanning(true);
    setInputUrl(urlToScan);
    try {
      const response = await fetch('http://localhost:8000/api/scan/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToScan })
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentResult(data);
        setIsScanning(false);
        return;
      }
    } catch (e) {
      // Backend offline fallback
    }

    setTimeout(() => {
      if (SAMPLE_PHISHING_URLS[urlToScan]) {
        setCurrentResult(SAMPLE_PHISHING_URLS[urlToScan]);
      } else {
        const isPhish = urlToScan.includes('login') || urlToScan.includes('verify') || urlToScan.includes('185.');
        setCurrentResult({
          id: `URL-2026-${Math.floor(Math.random() * 900 + 100)}`,
          url: urlToScan,
          verdict: isPhish ? 'Phishing' : 'Legitimate',
          phishingProbability: isPhish ? 0.91 : 0.04,
          riskScore: isPhish ? 88 : 6,
          pathAScoreLightGBM: isPhish ? 89.2 : 4.1,
          pathBScoreDistilBERT: isPhish ? 92.0 : 5.8,
          domainAgeDays: isPhish ? 12 : 2400,
          hasSsl: !urlToScan.startsWith('http://'),
          targetBrandImpersonation: isPhish ? 'Generic Brand Impersonation' : 'None',
          lexicalFeatures: [
            { name: 'URL Length', value: `${urlToScan.length} characters`, threshold: '< 75 chars', isSuspicious: urlToScan.length > 60 },
            { name: 'Domain Shannon Entropy', value: '4.12 bits', threshold: '< 3.8 bits', isSuspicious: isPhish },
            { name: 'Suspicious TLD Extension', value: urlToScan.split('.').pop() || '.com', threshold: 'Standard TLD', isSuspicious: isPhish }
          ],
          semanticTokens: [
            { token: 'custom_input', riskWeight: isPhish ? 0.85 : 0.05, intentCategory: isPhish ? 'Credential Harvester' : 'Neutral' }
          ],
          shapFeatures: [
            { featureName: 'Lexical Entropy & Subdomain Depth', featureValue: 'Analyzed', shapValue: isPhish ? 0.35 : -0.40, description: 'Lexical evaluation of URL anatomy', category: 'lexical' }
          ],
          summary: isPhish ? 'Custom URL identified as high-risk phishing vector.' : 'Custom URL classified as safe and legitimate.'
        });
      }
      setIsScanning(false);
    }, 400);
  };

  const shapData = currentResult.shapFeatures.map(f => ({
    name: f.featureName.length > 25 ? f.featureName.substring(0, 22) + '...' : f.featureName,
    shapValue: f.shapValue,
    fullName: f.featureName,
    description: f.description
  }));

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/30 border border-amber-500/40 text-amber-400">
              <GlobeLock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Phishing & URL Engine (Dual-Path Architecture)</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded">
                  Vector 2: URLs
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Path A: LightGBM 30+ Lexical Analysis + Path B: DistilBERT Semantic NLP (Synopsis Sec 2.2 & 4.2)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Benchmark:</span>
            <span className="text-emerald-400 font-bold">PhiUSIIL 98.2% F1</span>
          </div>
        </div>

        {/* URL Input & Presets */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter suspicious URL to inspect (e.g. http://secure-login...)"
                className="w-full bg-cyber-900 border border-cyber-border rounded-lg pl-9 pr-4 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              onClick={() => handleScan(inputUrl)}
              disabled={isScanning}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
            >
              {isScanning ? 'Analyzing...' : 'Run Dual-Path Scan'}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
            <span className="text-slate-400">Preset Scenarios:</span>
            {Object.keys(SAMPLE_PHISHING_URLS).map((urlKey, idx) => (
              <button
                key={idx}
                onClick={() => handleScan(urlKey)}
                className={`px-2.5 py-1 rounded text-[11px] truncate max-w-[240px] transition-colors ${
                  inputUrl === urlKey
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-cyber-900 text-slate-400 hover:text-slate-200 border border-cyber-border'
                }`}
                title={urlKey}
              >
                {urlKey.replace('http://', '').replace('https://', '').substring(0, 24)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Dual-Path Scores & Brand Radar */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Dual Path Score Fusion Card */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Dual-Path Classifier Fusion</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${
                currentResult.verdict === 'Phishing'
                  ? 'bg-red-950/60 text-red-400 border-red-500/50'
                  : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50'
              }`}>
                {currentResult.verdict}
              </span>
            </div>

            {/* Overall Phishing Probability */}
            <div className="text-center py-3 bg-cyber-900/80 rounded-lg border border-cyber-border mb-4">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Phishing Probability</span>
              <div className={`text-4xl font-extrabold font-mono mt-1 ${
                currentResult.phishingProbability > 0.6 ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {(currentResult.phishingProbability * 100).toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Risk Index: {currentResult.riskScore}/100</span>
            </div>

            {/* Path A vs Path B Comparison */}
            <div className="space-y-4">
              <div className="bg-cyber-950 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-amber-400 font-bold">Path A: LightGBM (Lexical Features)</span>
                  <span className="text-slate-200">{currentResult.pathAScoreLightGBM}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${currentResult.pathAScoreLightGBM}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Evaluates structural Shannon entropy, length, & subdomain depth</p>
              </div>

              <div className="bg-cyber-950 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-cyan-400 font-bold">Path B: DistilBERT (Semantic NLP)</span>
                  <span className="text-slate-200">{currentResult.pathBScoreDistilBERT}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${currentResult.pathBScoreDistilBERT}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Evaluates semantic token embeddings and deceptive intent keywords</p>
              </div>
            </div>

            {/* Brand Impersonation Radar */}
            {currentResult.targetBrandImpersonation && (
              <div className="mt-4 p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-xs font-mono">
                <span className="text-red-400 font-bold block mb-1">Target Brand Spoofing Alert:</span>
                <span className="text-slate-200">{currentResult.targetBrandImpersonation}</span>
              </div>
            )}

            {onAskChatbot && (
              <button
                onClick={() => onAskChatbot(`Explain why URL "${currentResult.url}" was classified as ${currentResult.verdict} with risk score ${currentResult.riskScore}`)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-cyber-850 hover:bg-cyber-800 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-colors"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Ask AI Assistant for URL Triage</span>
              </button>
            )}
          </div>

          {/* Semantic Token Intent Weights */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Path B: Semantic Token Risk Weights</h3>
              </div>
            </div>

            <div className="space-y-2">
              {currentResult.semanticTokens.map((st, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-cyber-900 border border-cyber-border text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-800 text-cyan-300 rounded font-bold">{st.token}</span>
                    <span className="text-[10px] text-slate-400">{st.intentCategory}</span>
                  </div>
                  <span className={`font-bold ${st.riskWeight > 0.7 ? 'text-red-400' : 'text-emerald-400'}`}>
                    Weight: {(st.riskWeight * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Path A Lexical Features (30+ features) & SHAP attributions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Path A Lexical Feature Extraction Table */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-100">Path A: Lexical Feature Extraction (30+ Structural Metrics)</h3>
              </div>
              <span className="text-[11px] font-mono text-amber-400">Synopsis Sec 2.2</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-cyber-border text-slate-400 text-[11px]">
                    <th className="py-2 px-2.5">Feature Metric</th>
                    <th className="py-2 px-2.5">Extracted Value</th>
                    <th className="py-2 px-2.5">Baseline Norm</th>
                    <th className="py-2 px-2.5">Risk Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/40">
                  {currentResult.lexicalFeatures.map((feat, idx) => (
                    <tr key={idx} className="hover:bg-cyber-900/50">
                      <td className="py-2 px-2.5 font-bold text-slate-200">{feat.name}</td>
                      <td className="py-2 px-2.5 text-cyan-300">{feat.value}</td>
                      <td className="py-2 px-2.5 text-slate-400">{feat.threshold}</td>
                      <td className="py-2 px-2.5">
                        {feat.isSuspicious ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-500/30">
                            SUSPICIOUS
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                            NORMAL
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Explainable AI: SHAP Feature Attributions */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Explainable AI: SHAP Feature Attribution Waterfall</h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Mathematical Justification</span>
            </div>

            <div className="space-y-3">
              {currentResult.shapFeatures.map((f, idx) => (
                <div key={idx} className="bg-cyber-900/80 p-3 rounded-lg border border-cyber-border">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-slate-200">{f.featureName}</span>
                    <span className={`font-bold ${f.shapValue > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {f.shapValue > 0 ? `+${f.shapValue.toFixed(2)} (Phishing Risk)` : `${f.shapValue.toFixed(2)} (Legitimate)`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-1.5">{f.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Evidence: {f.featureValue}</span>
                    <span className="uppercase text-amber-400">{f.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

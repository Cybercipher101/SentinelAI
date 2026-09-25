import React from 'react';
import { RiskSeverity } from '../types/cybersecurity';
import { ShieldCheck, ShieldAlert, AlertTriangle, Flame, Layers } from 'lucide-react';

interface UnifiedRiskScoreProps {
  score: number; // 0-100
  vectorScores: {
    malware: number;
    url: number;
    email: number;
    network: number;
  };
}

export const UnifiedRiskScore: React.FC<UnifiedRiskScoreProps> = ({ score, vectorScores }) => {
  const getSeverity = (val: number): { label: RiskSeverity; color: string; border: string; bg: string; icon: any } => {
    if (val <= 30) {
      return {
        label: 'Low',
        color: 'text-emerald-400',
        border: 'border-emerald-500/40',
        bg: 'bg-emerald-950/40',
        icon: ShieldCheck
      };
    }
    if (val <= 60) {
      return {
        label: 'Moderate',
        color: 'text-amber-400',
        border: 'border-amber-500/40',
        bg: 'bg-amber-950/40',
        icon: AlertTriangle
      };
    }
    if (val <= 80) {
      return {
        label: 'Elevated',
        color: 'text-orange-400',
        border: 'border-orange-500/40',
        bg: 'bg-orange-950/40',
        icon: ShieldAlert
      };
    }
    return {
      label: 'Critical',
      color: 'text-red-400',
      border: 'border-red-500/50',
      bg: 'bg-red-950/40',
      icon: Flame
    };
  };

  const currentSev = getSeverity(score);
  const SevIcon = currentSev.icon;

  // Circumference for radial progress circle
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 relative overflow-hidden shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border/70 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-800 text-cyan-400 border border-cyan-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Unified Threat Risk Index</h3>
            <p className="text-[11px] text-slate-400 font-mono">Normalized multi-vector index (0 - 100)</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase flex items-center gap-1.5 ${currentSev.bg} ${currentSev.border} ${currentSev.color} border`}>
          <SevIcon className="w-3.5 h-3.5" />
          <span>{currentSev.label} Risk</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        {/* Radial Score Gauge */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              {/* Background Track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="#1e293b"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress Track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={
                  score <= 30 ? '#10b981' :
                  score <= 60 ? '#f59e0b' :
                  score <= 80 ? '#f97316' : '#ef4444'
                }
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-extrabold font-mono tracking-tight ${currentSev.color}`}>
                {score}
              </span>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">
                / 100 Index
              </span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs text-slate-300 font-medium">Risk Score Normalization Engine</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Section 4.1 Orchestrator Fusion</p>
          </div>
        </div>

        {/* 4 Vector Breakdown Bars */}
        <div className="sm:col-span-7 space-y-3">
          <div className="text-xs text-slate-400 font-mono flex justify-between items-center mb-1">
            <span>HETEROGENEOUS VECTOR SCORES</span>
            <span className="text-[11px] text-cyan-400">Deep Learning Inference</span>
          </div>

          {/* Vector 1: Malware */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-mono">1. Malware Executables (CNN-LSTM)</span>
              <span className={`font-mono font-semibold ${getSeverity(vectorScores.malware).color}`}>
                {vectorScores.malware}/100
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full transition-all duration-700" 
                style={{ width: `${vectorScores.malware}%` }}
              ></div>
            </div>
          </div>

          {/* Vector 2: URL */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-mono">2. Phishing URL (Dual-Path)</span>
              <span className={`font-mono font-semibold ${getSeverity(vectorScores.url).color}`}>
                {vectorScores.url}/100
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700" 
                style={{ width: `${vectorScores.url}%` }}
              ></div>
            </div>
          </div>

          {/* Vector 3: Email */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-mono">3. Email Filtering (NLP/TF-IDF)</span>
              <span className={`font-mono font-semibold ${getSeverity(vectorScores.email).color}`}>
                {vectorScores.email}/100
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-700" 
                style={{ width: `${vectorScores.email}%` }}
              ></div>
            </div>
          </div>

          {/* Vector 4: Network */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-mono">4. Network NIDS (Autoencoder-LSTM)</span>
              <span className={`font-mono font-semibold ${getSeverity(vectorScores.network).color}`}>
                {vectorScores.network}/100
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-700" 
                style={{ width: `${vectorScores.network}%` }}
              ></div>
            </div>
          </div>

          {/* Risk Range Reference Footer */}
          <div className="grid grid-cols-4 gap-1 pt-2 text-[10px] font-mono text-center text-slate-500 border-t border-cyber-border/40">
            <span className="text-emerald-400/80 bg-emerald-950/30 py-0.5 rounded">0-30 Low</span>
            <span className="text-amber-400/80 bg-amber-950/30 py-0.5 rounded">31-60 Mod</span>
            <span className="text-orange-400/80 bg-orange-950/30 py-0.5 rounded">61-80 Elev</span>
            <span className="text-red-400/80 bg-red-950/30 py-0.5 rounded">81-100 Crit</span>
          </div>

        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { NetworkNidsResult } from '../types/cybersecurity';
import { SAMPLE_NETWORK_PCAP } from '../data/sampleScans';
import { 
  Activity, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Server, 
  Ban, 
  CheckCircle, 
  AlertOctagon, 
  Flame, 
  Bot,
  Wifi,
  HardDrive
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from 'recharts';

interface NetworkNidsViewProps {
  onAskChatbot?: (prompt: string) => void;
  initialPcapKey?: string;
  onBlockIp?: (ip: string) => void;
}

export const NetworkNidsView: React.FC<NetworkNidsViewProps> = ({
  onAskChatbot,
  initialPcapKey = 'pcap_ddos_syn_flood.pcap',
  onBlockIp
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(initialPcapKey);
  const [currentResult, setCurrentResult] = useState<NetworkNidsResult>(
    SAMPLE_NETWORK_PCAP[initialPcapKey] || SAMPLE_NETWORK_PCAP['pcap_ddos_syn_flood.pcap']
  );
  const [blockedIps, setBlockedIps] = useState<string[]>([]);

  const handleSelectPcap = (key: string) => {
    setSelectedKey(key);
    if (SAMPLE_NETWORK_PCAP[key]) {
      setCurrentResult(SAMPLE_NETWORK_PCAP[key]);
    }
  };

  const handleBlockIp = (ip: string) => {
    if (!blockedIps.includes(ip)) {
      setBlockedIps([...blockedIps, ip]);
      if (onBlockIp) onBlockIp(ip);
    }
  };

  const isAnomalous = currentResult.verdict.includes('Attack') || currentResult.verdict.includes('Anomaly');

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-600/20 to-rose-700/30 border border-red-500/40 text-red-400">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Network Anomaly Detection (Autoencoder-LSTM NIDS)</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded">
                  Vector 4: PCAP & NetFlow
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Unsupervised Autoencoder Reconstruction Error + Spatiotemporal LSTM Telemetry (Synopsis Sec 2.3 & 4.2)
              </p>
            </div>
          </div>

          {/* PCAP Selectors */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <span className="text-slate-400">PCAP Traces:</span>
            {Object.keys(SAMPLE_NETWORK_PCAP).map((key) => (
              <button
                key={key}
                onClick={() => handleSelectPcap(key)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedKey === key
                    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                    : 'bg-cyber-900 hover:bg-cyber-850 text-slate-400 border border-cyber-border'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Flow Telemetry, Autoencoder Reconstruction Loss, Top IPs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* NIDS Verdict & Reconstruction Error Gauge */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200">{currentResult.captureSource}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${
                isAnomalous
                  ? 'bg-red-950/60 text-red-400 border-red-500/50'
                  : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50'
              }`}>
                {currentResult.predictedAttackType}
              </span>
            </div>

            {/* Autoencoder Loss Metric Banner */}
            <div className="p-3.5 bg-cyber-900/90 rounded-lg border border-cyber-border mb-4">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Autoencoder Reconstruction Loss:</span>
                <span className={`text-sm font-bold ${
                  currentResult.autoencoderReconstructionError > currentResult.anomalyThreshold ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {currentResult.autoencoderReconstructionError.toFixed(3)}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden mb-1">
                <div 
                  className={`h-full rounded-full ${
                    currentResult.autoencoderReconstructionError > currentResult.anomalyThreshold ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(currentResult.autoencoderReconstructionError * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Baseline Loss: 0.050</span>
                <span className="text-amber-400">Anomaly Trigger Threshold: {currentResult.anomalyThreshold.toFixed(3)}</span>
              </div>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-4">
              <div className="bg-cyber-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">TOTAL PACKETS</span>
                <span className="text-slate-100 font-bold text-sm">{currentResult.totalPackets.toLocaleString()}</span>
              </div>
              <div className="bg-cyber-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">CAPTURE DURATION</span>
                <span className="text-slate-100 font-bold text-sm">{currentResult.flowDuration}</span>
              </div>
              <div className="bg-cyber-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">LSTM SEQUENCE ALERT</span>
                <span className={`font-bold text-sm ${isAnomalous ? 'text-red-400' : 'text-emerald-400'}`}>
                  {currentResult.lstmTemporalAlertScore}%
                </span>
              </div>
              <div className="bg-cyber-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">UNIFIED THREAT SCORE</span>
                <span className={`font-bold text-sm ${isAnomalous ? 'text-red-400' : 'text-emerald-400'}`}>
                  {currentResult.riskScore}/100
                </span>
              </div>
            </div>

            {onAskChatbot && (
              <button
                onClick={() => onAskChatbot(`Explain network anomaly in PCAP trace ${currentResult.captureSource} with attack type ${currentResult.predictedAttackType} and reconstruction loss ${currentResult.autoencoderReconstructionError}`)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-cyber-850 hover:bg-cyber-800 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-colors"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Ask AI to Analyze Network Anomaly</span>
              </button>
            )}
          </div>

          {/* Top Source IPs & Firewall Block Action */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold text-slate-100">Top Ingress Sources (CICIDS Flow IP)</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">1-Click Block</span>
            </div>

            <div className="space-y-2.5">
              {currentResult.topSourceIps.map((src, idx) => {
                const isBlocked = blockedIps.includes(src.ip);

                return (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-cyber-900 border border-cyber-border text-xs font-mono">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{src.ip}</span>
                        <span className="text-[10px] text-slate-400">({src.geo})</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Packets: {src.count.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleBlockIp(src.ip)}
                      disabled={isBlocked}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        isBlocked
                          ? 'bg-red-900/60 text-red-300 border border-red-500 cursor-not-allowed'
                          : 'bg-red-950 hover:bg-red-900 text-red-400 border border-red-500/40'
                      }`}
                    >
                      <Ban className="w-3 h-3" />
                      <span>{isBlocked ? 'BLOCKED' : 'Block IP'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Spatiotemporal Timeline Charts & SHAP Features */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Real-time Reconstruction Loss vs Anomaly Threshold Chart */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Autoencoder Reconstruction Loss vs Anomaly Threshold</h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Temporal Flow Window</span>
            </div>

            <div className="h-52 w-full mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentResult.flowTimeline} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 1.0]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: number) => [`Loss: ${val}`, 'Reconstruction Loss']}
                  />
                  <ReferenceLine y={currentResult.anomalyThreshold} label="Threshold (0.250)" stroke="#f59e0b" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="reconstructionLoss" stroke="#ef4444" fillOpacity={1} fill="url(#lossGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 border-t border-cyber-border/40">
              <span className="text-amber-400">Threshold: 0.250 (Trained normal baseline)</span>
              <span>Reconstruction divergence directly signals zero-day volumetric/exfiltration attacks</span>
            </div>
          </div>

          {/* Temporal LSTM SYN/ACK Ratio & Throughput Timeline */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-slate-100">LSTM Spatiotemporal SYN/ACK Ratio Dynamics</h3>
              </div>
              <span className="text-[11px] font-mono text-purple-400">CICIDS2017 Model</span>
            </div>

            <div className="h-44 w-full mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentResult.flowTimeline} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: number) => [`SYN/ACK: ${val}:1`, 'Handshake Ratio']}
                  />
                  <Line type="monotone" dataKey="synAckRatio" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Explainable AI: SHAP Network Feature Attributions */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Explainable AI: SHAP Feature Attributions</h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">NIDS Interpretability</span>
            </div>

            <div className="space-y-3">
              {currentResult.shapFeatures.map((f, idx) => (
                <div key={idx} className="bg-cyber-900/80 p-3 rounded-lg border border-cyber-border">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-slate-200">{f.featureName}</span>
                    <span className={`font-bold ${f.shapValue > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {f.shapValue > 0 ? `+${f.shapValue.toFixed(2)} (Attack Signature)` : `${f.shapValue.toFixed(2)} (Benign Flow)`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-1.5">{f.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Telemetry Value: {f.featureValue}</span>
                    <span className="uppercase text-purple-400">{f.category}</span>
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

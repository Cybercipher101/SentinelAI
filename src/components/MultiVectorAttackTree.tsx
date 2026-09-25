import React, { useState } from 'react';
import { MultiVectorAttackChain, MultiVectorCorrelationNode } from '../types/cybersecurity';
import { 
  GitBranch, 
  Mail, 
  Globe, 
  Binary, 
  Radio, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Bot,
  Zap
} from 'lucide-react';

interface MultiVectorAttackTreeProps {
  campaign: MultiVectorAttackChain;
  onSelectVector?: (vectorName: string, artifact: string) => void;
  onAskChatbot?: (prompt: string) => void;
}

export const MultiVectorAttackTree: React.FC<MultiVectorAttackTreeProps> = ({
  campaign,
  onSelectVector,
  onAskChatbot
}) => {
  const [selectedNode, setSelectedNode] = useState<MultiVectorCorrelationNode>(campaign.nodes[0]);

  const getVectorIcon = (vector: MultiVectorCorrelationNode['vector']) => {
    switch (vector) {
      case 'Email':
        return Mail;
      case 'URL':
        return Globe;
      case 'Malware':
        return Binary;
      case 'Network':
        return Radio;
    }
  };

  const getSeverityStyle = (sev: MultiVectorCorrelationNode['severity']) => {
    switch (sev) {
      case 'Critical':
        return 'text-red-400 bg-red-950/40 border-red-500/40';
      case 'Elevated':
        return 'text-orange-400 bg-orange-950/40 border-orange-500/40';
      case 'Moderate':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/40';
      case 'Low':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyber-border/70 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyber-800 text-cyan-400 border border-cyan-500/30">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">{campaign.title}</h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-500/40 rounded-full animate-pulse">
                {campaign.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Campaign: <span className="text-cyan-400">{campaign.campaignName}</span> | Threat Score: <strong className="text-red-400">{campaign.overallThreatScore}/100</strong>
            </p>
          </div>
        </div>

        {onAskChatbot && (
          <button
            onClick={() => onAskChatbot(`Explain the multi-vector attack correlation for incident ${campaign.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Correlation Explainer</span>
          </button>
        )}
      </div>

      {/* Narrative summary */}
      <div className="bg-cyber-900/90 border border-cyber-border/80 rounded-lg p-3 text-xs text-slate-300 mb-5 leading-relaxed">
        <span className="font-semibold text-cyan-400 font-mono">Cross-Vector Synthesis: </span>
        {campaign.narrative}
      </div>

      {/* Horizontal Interactive Kill Chain Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
        {campaign.nodes.map((node, index) => {
          const Icon = getVectorIcon(node.vector);
          const isSelected = selectedNode.id === node.id;
          const sevStyle = getSeverityStyle(node.severity);

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`cursor-pointer rounded-lg p-3.5 border transition-all relative ${
                isSelected
                  ? 'bg-cyber-800/90 border-cyan-400 shadow-md shadow-cyan-500/10'
                  : 'bg-cyber-900/60 border-cyber-border hover:bg-cyber-850 hover:border-slate-600'
              }`}
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                  Stage {index + 1}
                </span>
                <span className={`px-2 py-0.2 text-[10px] font-mono font-bold rounded-full border ${sevStyle}`}>
                  {node.severity}
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-cyan-500 text-cyber-950 font-bold' : 'bg-slate-800 text-cyan-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200 truncate">{node.vector} Vector</h4>
              </div>

              {/* Timestamp & brief */}
              <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{node.title}</p>
              
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1.5 border-t border-cyber-border/40">
                <span>{node.timestamp}</span>
                <span className="text-emerald-400 font-medium">{node.status}</span>
              </div>

              {/* Connecting arrow for desktop */}
              {index < campaign.nodes.length - 1 && (
                <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-cyan-500/60 pointer-events-none">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Node Deep-Dive Inspection Card */}
      <div className="bg-cyber-950/80 border border-cyber-border-light rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-cyber-border mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              Selected Stage Detail: [{selectedNode.vector} Telemetry]
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${getSeverityStyle(selectedNode.severity)}`}>
              {selectedNode.severity} Severity
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Artifact: <span className="text-slate-200 font-medium">{selectedNode.relatedArtifact}</span>
          </div>
        </div>

        <p className="text-xs text-slate-200 mb-3 leading-relaxed">
          {selectedNode.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Telemetry correlated into Unified Risk Index via Central Controller</span>
          </div>

          <div className="flex items-center gap-2">
            {onSelectVector && (
              <button
                onClick={() => onSelectVector(selectedNode.vector.toLowerCase(), selectedNode.relatedArtifact)}
                className="flex items-center gap-1 px-3 py-1 rounded bg-cyber-800 hover:bg-cyber-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors"
              >
                <span>Jump to {selectedNode.vector} Engine</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

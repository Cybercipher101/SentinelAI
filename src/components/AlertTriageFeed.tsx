import React, { useState } from 'react';
import { AlertItem, RiskSeverity } from '../types/cybersecurity';
import { 
  Bell, 
  Filter, 
  ShieldAlert, 
  Binary, 
  Globe, 
  Mail, 
  Radio, 
  GitBranch, 
  Search,
  CheckCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface AlertTriageFeedProps {
  alerts: AlertItem[];
  onInvestigateAlert: (alert: AlertItem) => void;
  onUpdateAlertStatus: (alertId: string, newStatus: AlertItem['status']) => void;
}

export const AlertTriageFeed: React.FC<AlertTriageFeedProps> = ({
  alerts,
  onInvestigateAlert,
  onUpdateAlertStatus
}) => {
  const [filterVector, setFilterVector] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getVectorIcon = (vector: AlertItem['vector']) => {
    switch (vector) {
      case 'Malware': return Binary;
      case 'URL': return Globe;
      case 'Email': return Mail;
      case 'Network': return Radio;
      case 'Multi-Vector': return GitBranch;
    }
  };

  const getSeverityBadge = (sev: RiskSeverity) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-950/60 text-red-400 border-red-500/40';
      case 'Elevated':
        return 'bg-orange-950/60 text-orange-400 border-orange-500/40';
      case 'Moderate':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/40';
      case 'Low':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40';
    }
  };

  const filteredAlerts = alerts.filter(item => {
    if (filterVector !== 'ALL' && item.vector !== filterVector) return false;
    if (filterSeverity !== 'ALL' && item.severity !== filterSeverity) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyber-border/70 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-800 text-amber-400 border border-amber-500/30">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Live SOC Alert Stream</h3>
            <p className="text-[11px] text-slate-400 font-mono">Real-time threat feed and telemetry triage</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts, CVEs, IPs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-cyber-900 border border-cyber-border rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48 sm:w-60"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-cyber-border/40">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          <span className="text-slate-500 text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Vector:
          </span>
          {['ALL', 'Multi-Vector', 'Malware', 'URL', 'Email', 'Network'].map((v) => (
            <button
              key={v}
              onClick={() => setFilterVector(v)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                filterVector === v
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-cyber-900 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500 text-[11px] mr-1">Severity:</span>
          {['ALL', 'Critical', 'Elevated', 'Moderate', 'Low'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                filterSeverity === s
                  ? 'bg-slate-700 text-white border border-slate-500'
                  : 'bg-cyber-900 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table / Stream */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No alerts match current filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const Icon = getVectorIcon(alert.vector);
            const sevBadge = getSeverityBadge(alert.severity);

            return (
              <div
                key={alert.id}
                className="bg-cyber-900/80 hover:bg-cyber-850/90 border border-cyber-border hover:border-slate-600 rounded-lg p-3 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-cyber-800 border border-cyber-border-light text-cyan-400 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold text-slate-100">{alert.title}</span>
                      <span className={`px-2 py-0.2 text-[10px] font-mono font-bold rounded border ${sevBadge}`}>
                        {alert.severity} ({alert.riskScore})
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {alert.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{alert.description}</p>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {alert.timestamp}
                      </span>
                      <span>Source: {alert.source}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="flex items-center gap-2 sm:self-center self-end">
                  <select
                    value={alert.status}
                    onChange={(e) => onUpdateAlertStatus(alert.id, e.target.value as AlertItem['status'])}
                    className="bg-cyber-950 border border-slate-700 rounded px-2 py-1 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Unresolved">Unresolved</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Resolved">Resolved</option>
                    <option value="False Positive">False Positive</option>
                  </select>

                  <button
                    onClick={() => onInvestigateAlert(alert)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

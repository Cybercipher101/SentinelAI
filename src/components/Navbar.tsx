import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Binary, 
  GlobeLock, 
  MailWarning, 
  Activity, 
  Sparkles, 
  Bot, 
  FileText, 
  BookOpen,
  Terminal,
  Cpu
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'malware'
  | 'phishing'
  | 'email'
  | 'network'
  | 'xai'
  | 'chatbot'
  | 'playbooks'
  | 'research';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openChatModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openChatModal }) => {
  const navItems = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard, badge: 'Unified' },
    { id: 'malware', label: 'Malware (CNN-LSTM)', icon: Binary, badge: 'Vector 1' },
    { id: 'phishing', label: 'Phishing URL (Dual-Path)', icon: GlobeLock, badge: 'Vector 2' },
    { id: 'email', label: 'Email Filter (NLP)', icon: MailWarning, badge: 'Vector 3' },
    { id: 'network', label: 'Network NIDS (AE-LSTM)', icon: Activity, badge: 'Vector 4' },
    { id: 'xai', label: 'Explainable AI (SHAP)', icon: Sparkles, badge: 'XAI' },
    { id: 'chatbot', label: 'AI SOC Copilot', icon: Bot, badge: 'RAG' },
    { id: 'playbooks', label: 'Playbooks & IoC', icon: Terminal, badge: 'Action' },
    { id: 'research', label: 'Research & Synopsis', icon: BookOpen, badge: 'Docs' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-cyber-950/95 backdrop-blur-md border-b border-cyber-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/50 shadow-lg shadow-cyan-500/10">
              <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse-slow" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-cyber-950"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold tracking-wider text-slate-100 bg-clip-text">
                  AI CYBERSECURITY ASSISTANT
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <span>Multi-Modal DL</span>
                <span className="text-slate-600">•</span>
                <span>XAI (SHAP)</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">RAG Grounded</span>
              </p>
            </div>
          </div>

          {/* Quick AI SOC Assistant Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'chatbot'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-cyber-850 hover:bg-cyber-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-300" />
              <span>SOC Assistant</span>
              <span className="px-1 py-0.2 bg-cyan-400/20 text-cyan-200 text-[10px] rounded">Live</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-cyber-border/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavTab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-850 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

// TypeScript Definitions for AI Cybersecurity Assistance Platform

export type RiskSeverity = 'Low' | 'Moderate' | 'Elevated' | 'Critical';

export interface RiskScoreBreakdown {
  overallScore: number; // 0 - 100
  severity: RiskSeverity;
  color: string;
  malwareRisk: number;
  urlRisk: number;
  emailRisk: number;
  networkRisk: number;
  confidence: number;
  timestamp: string;
}

export interface ShapFeature {
  featureName: string;
  featureValue: string | number;
  shapValue: number; // positive increases risk, negative decreases
  description: string;
  category: 'structural' | 'behavioral' | 'lexical' | 'semantic' | 'temporal' | 'entropy';
}

export interface PEHeaderSection {
  name: string;
  virtualSize: string;
  rawSize: string;
  entropy: number;
  isExecutable: boolean;
  isWritable: boolean;
  status: 'benign' | 'suspicious' | 'anomalous';
}

export interface ApiCallSequence {
  order: number;
  timestamp: string;
  apiName: string;
  module: string;
  arguments: string;
  riskWeight: number;
  category: 'Process Injection' | 'Persistence' | 'Evasion' | 'Exfiltration' | 'Cryptography' | 'Standard';
}

export interface MalwareScanResult {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  md5: string;
  sha256: string;
  detectionVerdict: 'Malicious' | 'Suspicious' | 'Benign';
  malwareFamily?: 'Ransomware' | 'Trojan.Dropper' | 'Worm' | 'Spyware.Stealer' | 'Clean Executable';
  cnnSpatialConfidence: number; // 0-100%
  lstmTemporalConfidence: number; // 0-100%
  fusedProbability: number; // 0-1
  overallRiskScore: number; // 0-100
  sections: PEHeaderSection[];
  apiCalls: ApiCallSequence[];
  byteMatrixEntropy: number[];
  shapFeatures: ShapFeature[];
  summary: string;
}

export interface LexicalFeature {
  name: string;
  value: string | number;
  threshold: string;
  isSuspicious: boolean;
}

export interface PhishingScanResult {
  id: string;
  url: string;
  verdict: 'Phishing' | 'Suspicious' | 'Legitimate';
  phishingProbability: number; // 0-1
  riskScore: number; // 0-100
  pathAScoreLightGBM: number; // 0-100
  pathBScoreDistilBERT: number; // 0-100
  lexicalFeatures: LexicalFeature[];
  semanticTokens: {
    token: string;
    riskWeight: number;
    intentCategory: 'Credential Harvester' | 'Urgency Bait' | 'Brand Impersonation' | 'Neutral';
  }[];
  targetBrandImpersonation?: string;
  domainAgeDays: number;
  hasSsl: boolean;
  shapFeatures: ShapFeature[];
  summary: string;
}

export interface EmailScanResult {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  timestamp: string;
  verdict: 'Malicious / Phishing' | 'Suspicious Spam' | 'Clean Inbound';
  riskScore: number;
  urgencyScore: number; // 0-100
  deceptiveIntentScore: number; // 0-100
  senderAuthentication: {
    spf: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE';
    dkim: 'PASS' | 'FAIL' | 'NONE';
    dmarc: 'PASS' | 'FAIL' | 'NONE';
    isSpoofed: boolean;
  };
  nlpPreprocessing: {
    rawTokens: number;
    cleanedTokens: number;
    stopWordsRemoved: number;
    stemmedKeywords: string[];
  };
  tfIdfTopKeywords: {
    word: string;
    weight: number;
    triggerCategory: 'Financial' | 'Urgency' | 'Security Alert' | 'Account Action';
  }[];
  extractedUrls: string[];
  extractedAttachments: string[];
  shapFeatures: ShapFeature[];
  summary: string;
}

export interface NetworkFlowDataPoint {
  time: string;
  packetLength: number;
  flowDurationMs: number;
  reconstructionLoss: number;
  anomalyThreshold: number;
  synAckRatio: number;
  bytesPerSecond: number;
  isAnomaly: boolean;
}

export interface NetworkNidsResult {
  id: string;
  captureSource: string;
  totalPackets: number;
  flowDuration: string;
  verdict: 'Critical Anomaly (Attack Detected)' | 'Suspicious Telemetry' | 'Normal Traffic';
  predictedAttackType: 'Benign' | 'DDoS Volumetric' | 'Slowloris / PortScan' | 'C2 Beaconing' | 'Data Exfiltration' | 'Brute Force';
  riskScore: number;
  autoencoderReconstructionError: number;
  anomalyThreshold: number;
  lstmTemporalAlertScore: number;
  topSourceIps: { ip: string; count: number; geo: string; blocked: boolean }[];
  topTargetPorts: { port: number; service: string; flag: string }[];
  flowTimeline: NetworkFlowDataPoint[];
  shapFeatures: ShapFeature[];
  summary: string;
}

export interface MultiVectorCorrelationNode {
  id: string;
  vector: 'Email' | 'URL' | 'Malware' | 'Network';
  title: string;
  description: string;
  timestamp: string;
  severity: RiskSeverity;
  relatedArtifact: string;
  status: 'Detected' | 'Correlated' | 'Mitigated';
}

export interface MultiVectorAttackChain {
  id: string;
  title: string;
  campaignName: string;
  overallThreatScore: number;
  status: 'Active Incident' | 'Contained' | 'Under Investigation';
  startTime: string;
  nodes: MultiVectorCorrelationNode[];
  narrative: string;
  recommendedPlaybook: string;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  vector: 'Email' | 'URL' | 'Malware' | 'Network' | 'Multi-Vector';
  severity: RiskSeverity;
  title: string;
  description: string;
  riskScore: number;
  source: string;
  status: 'Unresolved' | 'Investigating' | 'Resolved' | 'False Positive';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  groundedTelemetry?: {
    vector?: string;
    riskScore?: number;
    iocFound?: string[];
    shapExplanation?: string;
  };
  suggestedActions?: {
    label: string;
    actionType: 'isolate_host' | 'block_ip' | 'quarantine_file' | 'generate_report' | 'custom';
    payload?: string;
  }[];
}

export interface IncidentPlaybook {
  id: string;
  title: string;
  threatType: string;
  severity: RiskSeverity;
  triggerCondition: string;
  steps: {
    stepNumber: number;
    title: string;
    command?: string;
    description: string;
    status: 'pending' | 'completed' | 'skipped';
  }[];
  iocs: {
    type: 'IP' | 'Domain' | 'URL' | 'SHA256' | 'Email';
    value: string;
    description: string;
  }[];
}

export interface ResearchReference {
  citationNumber: number;
  authors: string;
  title: string;
  publication: string;
  year: number;
  relevanceToProject: string;
  comparedApproach: string;
  ourAdvantage: string;
}

import {
  MalwareScanResult,
  PhishingScanResult,
  EmailScanResult,
  NetworkNidsResult,
  MultiVectorAttackChain,
  AlertItem,
  IncidentPlaybook
} from '../types/cybersecurity';

export const SAMPLE_MALWARE_DATA: Record<string, MalwareScanResult> = {
  'invoice_payment_2026.exe': {
    id: 'MAL-2026-0881',
    fileName: 'invoice_payment_2026.exe',
    fileSize: '4.82 MB',
    fileType: 'PE32+ Executable (GUI) x86-64',
    md5: '7e2b8c9d4a1f3e5b6c7d8e9f0a1b2c3d',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    detectionVerdict: 'Malicious',
    malwareFamily: 'Ransomware',
    cnnSpatialConfidence: 98.6,
    lstmTemporalConfidence: 96.4,
    fusedProbability: 0.978,
    overallRiskScore: 94,
    sections: [
      { name: '.text', virtualSize: '0x00045000', rawSize: '282 KB', entropy: 6.82, isExecutable: true, isWritable: false, status: 'suspicious' },
      { name: '.rdata', virtualSize: '0x00012000', rawSize: '74 KB', entropy: 5.12, isExecutable: false, isWritable: false, status: 'benign' },
      { name: '.data', virtualSize: '0x00028000', rawSize: '164 KB', entropy: 4.90, isExecutable: false, isWritable: true, status: 'benign' },
      { name: '.upx0', virtualSize: '0x00085000', rawSize: '0 KB', entropy: 7.94, isExecutable: true, isWritable: true, status: 'anomalous' },
      { name: '.rsrc', virtualSize: '0x00031000', rawSize: '198 KB', entropy: 7.85, isExecutable: false, isWritable: false, status: 'anomalous' }
    ],
    apiCalls: [
      { order: 1, timestamp: '+0.002s', apiName: 'VirtualAllocEx', module: 'kernel32.dll', arguments: 'Process=0x4A8, Size=0x10000, FlProtect=PAGE_EXECUTE_READWRITE', riskWeight: 0.88, category: 'Process Injection' },
      { order: 2, timestamp: '+0.015s', apiName: 'WriteProcessMemory', module: 'kernel32.dll', arguments: 'BaseAddress=0x7FFF0000, Buffer=Shellcode', riskWeight: 0.92, category: 'Process Injection' },
      { order: 3, timestamp: '+0.028s', apiName: 'CreateRemoteThread', module: 'kernel32.dll', arguments: 'TargetPid=1044 (explorer.exe), StartRoutine=0x7FFF0000', riskWeight: 0.96, category: 'Process Injection' },
      { order: 4, timestamp: '+0.064s', apiName: 'CryptEncrypt', module: 'advapi32.dll', arguments: 'Algorithm=AES-256-CBC, TargetExt=[.docx, .xlsx, .pdf, .sql]', riskWeight: 0.95, category: 'Cryptography' },
      { order: 5, timestamp: '+0.112s', apiName: 'RegSetValueExA', module: 'advapi32.dll', arguments: 'Key=HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', riskWeight: 0.79, category: 'Persistence' },
      { order: 6, timestamp: '+0.150s', apiName: 'DeleteShadowCopies', module: 'vssadmin.exe', arguments: 'vssadmin delete shadows /all /quiet', riskWeight: 0.98, category: 'Evasion' }
    ],
    byteMatrixEntropy: [6.8, 7.1, 7.9, 7.8, 6.2, 5.5, 7.9, 8.0, 7.4, 6.9, 5.1, 7.7],
    shapFeatures: [
      { featureName: 'High Section Entropy (.upx0 & .rsrc)', featureValue: '7.94 / 8.0', shapValue: 0.38, description: 'Packed/Encrypted binary code detected indicating anti-analysis evasion', category: 'entropy' },
      { featureName: 'API Sequence: VirtualAllocEx + RemoteThread', featureValue: 'Process Injection Pattern', shapValue: 0.34, description: 'Simulated runtime API call chain matches known process hollowing', category: 'behavioral' },
      { featureName: 'VSS Shadow Copy Deletion Call', featureValue: 'vssadmin delete shadows', shapValue: 0.22, description: 'High-confidence ransomware behavior attempting to prevent file restoration', category: 'behavioral' },
      { featureName: 'Executable Header Writable Flag', featureValue: 'W+X Section Perms', shapValue: 0.16, description: 'Section headers possess both Write and Execute permissions simultaneously', category: 'structural' },
      { featureName: 'Standard Code Signing Certificate', featureValue: 'Invalid / Self-Signed', shapValue: 0.08, description: 'Untrusted or forged digital signature metadata', category: 'structural' }
    ],
    summary: 'High-confidence Ransomware payload identified by hybrid CNN-LSTM. Static CNN analysis detected extreme byte entropy textures in .upx0 sections (7.94 entropy), while LSTM sequence tracking identified memory injection and shadow copy deletion.'
  },
  'svchost_updater.dll': {
    id: 'MAL-2026-0412',
    fileName: 'svchost_updater.dll',
    fileSize: '1.42 MB',
    fileType: 'PE32+ DLL (x86-64)',
    md5: '4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    detectionVerdict: 'Malicious',
    malwareFamily: 'Trojan.Dropper',
    cnnSpatialConfidence: 91.2,
    lstmTemporalConfidence: 89.5,
    fusedProbability: 0.903,
    overallRiskScore: 82,
    sections: [
      { name: '.text', virtualSize: '0x00015000', rawSize: '86 KB', entropy: 6.45, isExecutable: true, isWritable: false, status: 'suspicious' },
      { name: '.rdata', virtualSize: '0x00008000', rawSize: '32 KB', entropy: 4.80, isExecutable: false, isWritable: false, status: 'benign' },
      { name: '.reloc', virtualSize: '0x00004000', rawSize: '16 KB', entropy: 5.20, isExecutable: false, isWritable: false, status: 'benign' }
    ],
    apiCalls: [
      { order: 1, timestamp: '+0.005s', apiName: 'InternetOpenA', module: 'wininet.dll', arguments: 'Agent="Mozilla/5.0"', riskWeight: 0.40, category: 'Exfiltration' },
      { order: 2, timestamp: '+0.040s', apiName: 'URLDownloadToFileA', module: 'urlmon.dll', arguments: 'URL=http://185.220.101.5/payload.bin, Dest=C:\\Temp\\stage2.bin', riskWeight: 0.85, category: 'Exfiltration' },
      { order: 3, timestamp: '+0.082s', apiName: 'ShellExecuteA', module: 'shell32.dll', arguments: 'Op="open", File="C:\\Temp\\stage2.bin"', riskWeight: 0.78, category: 'Persistence' }
    ],
    byteMatrixEntropy: [5.2, 6.1, 6.4, 6.8, 5.9, 4.8, 6.5, 6.2],
    shapFeatures: [
      { featureName: 'Direct HTTP Payload Stager', featureValue: 'URLDownloadToFileA', shapValue: 0.42, description: 'Downloads secondary payload directly into temporary directory', category: 'behavioral' },
      { featureName: 'System Service Mimicry', featureValue: 'Name: svchost_updater.dll', shapValue: 0.28, description: 'Masquerading as legitimate Windows svchost host service', category: 'structural' },
      { featureName: 'Absence of Digital Signature', featureValue: 'Unsigned Binary', shapValue: 0.18, description: 'PE does not contain valid authenticode signature', category: 'structural' }
    ],
    summary: 'Staged Trojan Dropper targeting system privilege persistence and secondary payload retrieval.'
  },
  'calc_system.exe': {
    id: 'BEN-2026-0019',
    fileName: 'calc_system.exe',
    fileSize: '380 KB',
    fileType: 'PE32+ Executable (GUI) x86-64',
    md5: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
    sha256: 'bc94827d09b68a3f5a2e1d7c9b8a0f2e4d6c8b0a2e4f6d8c0b2a4e6f8d0a2c4e',
    detectionVerdict: 'Benign',
    malwareFamily: 'Clean Executable',
    cnnSpatialConfidence: 1.2,
    lstmTemporalConfidence: 2.1,
    fusedProbability: 0.015,
    overallRiskScore: 4,
    sections: [
      { name: '.text', virtualSize: '0x00010000', rawSize: '64 KB', entropy: 5.40, isExecutable: true, isWritable: false, status: 'benign' },
      { name: '.rdata', virtualSize: '0x00006000', rawSize: '24 KB', entropy: 4.10, isExecutable: false, isWritable: false, status: 'benign' },
      { name: '.data', virtualSize: '0x00004000', rawSize: '16 KB', entropy: 3.20, isExecutable: false, isWritable: true, status: 'benign' }
    ],
    apiCalls: [
      { order: 1, timestamp: '+0.001s', apiName: 'GetStartupInfoW', module: 'kernel32.dll', arguments: 'lpStartupInfo', riskWeight: 0.02, category: 'Standard' },
      { order: 2, timestamp: '+0.004s', apiName: 'CreateWindowExW', module: 'user32.dll', arguments: 'Class="CalcFrame", Style=WS_OVERLAPPEDWINDOW', riskWeight: 0.01, category: 'Standard' },
      { order: 3, timestamp: '+0.012s', apiName: 'ShowWindow', module: 'user32.dll', arguments: 'nCmdShow=SW_SHOW', riskWeight: 0.01, category: 'Standard' }
    ],
    byteMatrixEntropy: [4.8, 5.1, 5.3, 5.0, 4.2, 3.8, 4.9, 5.2],
    shapFeatures: [
      { featureName: 'Normal Entropy Distribution', featureValue: 'Mean Entropy 4.8', shapValue: -0.45, description: 'Uniform non-compressed byte distribution throughout binary', category: 'entropy' },
      { featureName: 'Standard GUI Windows APIs', featureValue: 'CreateWindowEx, ShowWindow', shapValue: -0.32, description: 'Harmless window creation and UI event loop functions', category: 'behavioral' },
      { featureName: 'Valid Microsoft CA Signature', featureValue: 'Signed by MS Corporation', shapValue: -0.28, description: 'Authenticode verified by trusted root certificate authority', category: 'structural' }
    ],
    summary: 'Legitimate benign application. All structural and behavioral indicators fall well within baseline safety thresholds.'
  }
};

export const SAMPLE_PHISHING_URLS: Record<string, PhishingScanResult> = {
  'http://secure-login-microsoft365.account-verify.online/auth/login.php?session=9283': {
    id: 'URL-2026-904',
    url: 'http://secure-login-microsoft365.account-verify.online/auth/login.php?session=9283',
    verdict: 'Phishing',
    phishingProbability: 0.962,
    riskScore: 92,
    pathAScoreLightGBM: 94.8,
    pathBScoreDistilBERT: 97.6,
    domainAgeDays: 4,
    hasSsl: false,
    targetBrandImpersonation: 'Microsoft Corporation (Office 365)',
    lexicalFeatures: [
      { name: 'URL Length', value: '79 characters', threshold: '< 54 chars', isSuspicious: true },
      { name: 'Subdomain Count & Depth', value: '3 (secure-login-microsoft365)', threshold: '<= 1', isSuspicious: true },
      { name: 'Hyphen Count in Host', value: '3 hyphens', threshold: '<= 1', isSuspicious: true },
      { name: 'Shannon Domain Entropy', value: '4.68 bits', threshold: '< 3.8 bits', isSuspicious: true },
      { name: 'Suspicious TLD Extension', value: '.online', threshold: 'Standard (.com, .edu, .org)', isSuspicious: true },
      { name: 'Presence of IP in Domain', value: 'No', threshold: 'Domain string', isSuspicious: false },
      { name: 'Sensitive Keyword Matching', value: '["secure", "login", "account", "verify"]', threshold: '0-1 keyword', isSuspicious: true }
    ],
    semanticTokens: [
      { token: 'microsoft365', riskWeight: 0.95, intentCategory: 'Brand Impersonation' },
      { token: 'account-verify', riskWeight: 0.88, intentCategory: 'Urgency Bait' },
      { token: 'login.php', riskWeight: 0.78, intentCategory: 'Credential Harvester' },
      { token: 'secure', riskWeight: 0.65, intentCategory: 'Brand Impersonation' },
      { token: 'session', riskWeight: 0.45, intentCategory: 'Credential Harvester' }
    ],
    shapFeatures: [
      { featureName: 'Brand Spoofing Token (microsoft365 on .online TLD)', featureValue: 'Cross-Domain Mismatch', shapValue: 0.41, description: 'Semantic model detected high cosine similarity to Microsoft Office auth but hosted on unregistered non-MS domain', category: 'semantic' },
      { featureName: 'Excessive Subdomain Concatenation', featureValue: 'Depth: 3', shapValue: 0.29, description: 'Lexical model flagged domain stuffing intended to mislead mobile browser URL bars', category: 'lexical' },
      { featureName: 'Young Domain Registration', featureValue: '4 Days Old', shapValue: 0.18, description: 'Domain registered within the last 96 hours', category: 'structural' },
      { featureName: 'Credential Harvesting Query String', featureValue: 'login.php?session=', shapValue: 0.12, description: 'Standard phishing kit URI routing structure', category: 'lexical' }
    ],
    summary: 'Credential harvesting phishing page impersonating Microsoft 365. Dual-Path classifier fused high structural lexical anomalies (score 94.8) and Transformer semantic intent tokens (score 97.6).'
  },
  'http://185.220.101.5/dl/payload.bin': {
    id: 'URL-2026-905',
    url: 'http://185.220.101.5/dl/payload.bin',
    verdict: 'Phishing',
    phishingProbability: 0.985,
    riskScore: 97,
    pathAScoreLightGBM: 99.1,
    pathBScoreDistilBERT: 92.4,
    domainAgeDays: 0,
    hasSsl: false,
    targetBrandImpersonation: 'Direct Dropper Server',
    lexicalFeatures: [
      { name: 'Raw IPv4 Address in Host', value: '185.220.101.5', threshold: 'FQDN required', isSuspicious: true },
      { name: 'Executable Binary File Path', value: '.bin', threshold: 'HTML / Web content', isSuspicious: true },
      { name: 'Absence of HTTPS/TLS', value: 'HTTP Port 80', threshold: 'HTTPS required', isSuspicious: true },
      { name: 'Shannon Domain Entropy', value: '2.1 bits', threshold: '< 3.8 bits', isSuspicious: false }
    ],
    semanticTokens: [
      { token: '185.220.101.5', riskWeight: 0.99, intentCategory: 'Neutral' },
      { token: 'payload.bin', riskWeight: 0.96, intentCategory: 'Credential Harvester' },
      { token: 'dl', riskWeight: 0.70, intentCategory: 'Neutral' }
    ],
    shapFeatures: [
      { featureName: 'Direct IP Host Format', featureValue: '185.220.101.5', shapValue: 0.52, description: 'Use of raw public IPv4 without DNS resolution is a signature indicator of C2 payload hosts', category: 'lexical' },
      { featureName: 'Direct Binary File Extension (.bin)', featureValue: 'payload.bin', shapValue: 0.38, description: 'Direct unvalidated download vector for raw compiled binaries', category: 'semantic' }
    ],
    summary: 'Direct raw IP dropper server hosting binary malware payload. Bypasses DNS caching.'
  },
  'https://www.graphicerahilluniversity.edu.in/portal/students': {
    id: 'URL-2026-101',
    url: 'https://www.graphicerahilluniversity.edu.in/portal/students',
    verdict: 'Legitimate',
    phishingProbability: 0.008,
    riskScore: 2,
    pathAScoreLightGBM: 1.4,
    pathBScoreDistilBERT: 0.9,
    domainAgeDays: 4200,
    hasSsl: true,
    targetBrandImpersonation: 'None (Legitimate University Domain)',
    lexicalFeatures: [
      { name: 'URL Length', value: '59 characters', threshold: '< 75 chars', isSuspicious: false },
      { name: 'Accredited TLD', value: '.edu.in', threshold: 'Trusted Educational TLD', isSuspicious: false },
      { name: 'Valid Extended Validation SSL', value: 'TLS 1.3 Active', threshold: 'HTTPS required', isSuspicious: false },
      { name: 'Domain Age', value: '4,200+ days (>11 years)', threshold: '> 365 days', isSuspicious: false }
    ],
    semanticTokens: [
      { token: 'graphicera', riskWeight: 0.01, intentCategory: 'Neutral' },
      { token: 'hilluniversity', riskWeight: 0.01, intentCategory: 'Neutral' },
      { token: 'portal', riskWeight: 0.02, intentCategory: 'Neutral' },
      { token: 'students', riskWeight: 0.01, intentCategory: 'Neutral' }
    ],
    shapFeatures: [
      { featureName: 'Trusted Educational TLD (.edu.in)', featureValue: 'Accredited Top Level Domain', shapValue: -0.48, description: 'High-reputation verified academic registrar domain', category: 'lexical' },
      { featureName: 'Long Established Domain Age', featureValue: '11+ Years Active', shapValue: -0.36, description: 'Domain history establishes strong defensive reputation score', category: 'structural' },
      { featureName: 'Valid High-Grade SSL Certificate', featureValue: 'Let\'s Encrypt / DigiCert EV', shapValue: -0.22, description: 'Legitimate cryptographic signature and domain owner verification', category: 'structural' }
    ],
    summary: 'Official and verified institutional portal for Graphic Era Hill University. Zero threat vectors detected.'
  }
};

export const SAMPLE_EMAILS: Record<string, EmailScanResult> = {
  'urgent_payroll_wire.eml': {
    id: 'EML-2026-772',
    sender: 'finance-desk@payroll-update-gehu-corp.net',
    recipient: 'hrithik.raj@gehu.ac.in',
    subject: 'URGENT: Immediate Account Suspension - Wire Verification Required Within 2 Hours',
    timestamp: '2026-09-18 13:42:10 UTC',
    verdict: 'Malicious / Phishing',
    riskScore: 89,
    urgencyScore: 96,
    deceptiveIntentScore: 92,
    senderAuthentication: {
      spf: 'FAIL',
      dkim: 'FAIL',
      dmarc: 'FAIL',
      isSpoofed: true
    },
    nlpPreprocessing: {
      rawTokens: 342,
      cleanedTokens: 148,
      stopWordsRemoved: 194,
      stemmedKeywords: ['urgent', 'suspend', 'verifi', 'wire', 'immedi', 'penalti', 'author', 'direct', 'passcode']
    },
    tfIdfTopKeywords: [
      { word: 'immediate action', weight: 0.48, triggerCategory: 'Urgency' },
      { word: 'account suspended', weight: 0.44, triggerCategory: 'Security Alert' },
      { word: 'wire transfer', weight: 0.41, triggerCategory: 'Financial' },
      { word: 'verify identity', weight: 0.38, triggerCategory: 'Account Action' },
      { word: 'financial penalty', weight: 0.35, triggerCategory: 'Urgency' }
    ],
    extractedUrls: ['http://secure-login-microsoft365.account-verify.online/auth/login.php?session=9283'],
    extractedAttachments: ['payroll_compliance_form.exe (Disguised Executable)'],
    shapFeatures: [
      { featureName: 'Deceptive Urgency & Intimidation NLP Cues', featureValue: 'Urgency Index 96/100', shapValue: 0.42, description: 'NLP semantic transformer flagged psychological pressure techniques designed to bypass human verification', category: 'semantic' },
      { featureName: 'SPF & DMARC Sender Authentication Failure', featureValue: 'SPF=FAIL, DMARC=FAIL', shapValue: 0.32, description: 'Sender address is forged and did not originate from authorized MX mail servers', category: 'structural' },
      { featureName: 'Embedded Malicious Phishing URL Link', featureValue: '1 High-Risk Link Found', shapValue: 0.26, description: 'URL routes to credential harvesting phishing portal', category: 'lexical' }
    ],
    summary: 'High-severity spear-phishing attack utilizing Business Email Compromise (BEC) techniques. Email contains high psychological urgency keywords, failed sender DMARC checks, and links to a credential harvesting site.'
  },
  'gehu_project_defense.eml': {
    id: 'EML-2026-105',
    sender: 'saksham.mittal@gehu.ac.in',
    recipient: 'hrithik.raj@gehu.ac.in, shrut.malviya@gehu.ac.in',
    subject: 'Schedule: AI Cybersecurity Assistance Project Defense CSE27-386',
    timestamp: '2026-09-18 10:15:00 UTC',
    verdict: 'Clean Inbound',
    riskScore: 3,
    urgencyScore: 12,
    deceptiveIntentScore: 2,
    senderAuthentication: {
      spf: 'PASS',
      dkim: 'PASS',
      dmarc: 'PASS',
      isSpoofed: false
    },
    nlpPreprocessing: {
      rawTokens: 210,
      cleanedTokens: 110,
      stopWordsRemoved: 100,
      stemmedKeywords: ['schedul', 'project', 'defens', 'faculti', 'graphic', 'era', 'synopsi', 'cse', 'present']
    },
    tfIdfTopKeywords: [
      { word: 'project defense', weight: 0.42, triggerCategory: 'Account Action' },
      { word: 'synopsis submission', weight: 0.36, triggerCategory: 'Account Action' },
      { word: 'graphic era', weight: 0.31, triggerCategory: 'Security Alert' }
    ],
    extractedUrls: ['https://www.graphicerahilluniversity.edu.in/portal/students'],
    extractedAttachments: ['Project_Rubric_2026.pdf'],
    shapFeatures: [
      { featureName: 'Valid Institutional SPF & DKIM Alignment', featureValue: 'PASS / Verified GEHU Mail', shapValue: -0.52, description: 'Authenticated sender domain with 100% cryptographic header integrity', category: 'structural' },
      { featureName: 'Absence of Coercive Action or Financial Demands', featureValue: 'Urgency Index 12/100', shapValue: -0.38, description: 'Informational academic communication without urgency deception', category: 'semantic' }
    ],
    summary: 'Authentic internal university communication regarding CSE27-386 major project defense. Clean sender reputation and zero suspicious vectors.'
  }
};

export const SAMPLE_NETWORK_PCAP: Record<string, NetworkNidsResult> = {
  'pcap_ddos_syn_flood.pcap': {
    id: 'NET-2026-553',
    captureSource: 'eth0_gateway_promiscuous.pcap (CICIDS2017 Format)',
    totalPackets: 842900,
    flowDuration: '12m 45s',
    verdict: 'Critical Anomaly (Attack Detected)',
    predictedAttackType: 'DDoS Volumetric',
    riskScore: 96,
    autoencoderReconstructionError: 0.942,
    anomalyThreshold: 0.250,
    lstmTemporalAlertScore: 98.4,
    topSourceIps: [
      { ip: '185.220.101.5', count: 342100, geo: 'Tor Exit Node / RU', blocked: false },
      { ip: '194.26.29.112', count: 289400, geo: 'Suspicious Cloud / NL', blocked: false },
      { ip: '45.154.255.89', count: 184500, geo: 'Botnet Cluster / BG', blocked: false }
    ],
    topTargetPorts: [
      { port: 80, service: 'HTTP', flag: 'SYN Flood' },
      { port: 443, service: 'HTTPS', flag: 'TCP Reset Flood' },
      { port: 8443, service: 'C2 Alt-SSL', flag: 'High Ingress Volume' }
    ],
    flowTimeline: [
      { time: '13:30', packetLength: 64, flowDurationMs: 12, reconstructionLoss: 0.08, anomalyThreshold: 0.25, synAckRatio: 1.02, bytesPerSecond: 12400, isAnomaly: false },
      { time: '13:32', packetLength: 64, flowDurationMs: 15, reconstructionLoss: 0.12, anomalyThreshold: 0.25, synAckRatio: 1.05, bytesPerSecond: 15200, isAnomaly: false },
      { time: '13:34', packetLength: 128, flowDurationMs: 40, reconstructionLoss: 0.22, anomalyThreshold: 0.25, synAckRatio: 1.80, bytesPerSecond: 45000, isAnomaly: false },
      { time: '13:36', packetLength: 64, flowDurationMs: 2, reconstructionLoss: 0.68, anomalyThreshold: 0.25, synAckRatio: 48.5, bytesPerSecond: 890000, isAnomaly: true },
      { time: '13:38', packetLength: 64, flowDurationMs: 1, reconstructionLoss: 0.94, anomalyThreshold: 0.25, synAckRatio: 142.0, bytesPerSecond: 3400000, isAnomaly: true },
      { time: '13:40', packetLength: 64, flowDurationMs: 1, reconstructionLoss: 0.92, anomalyThreshold: 0.25, synAckRatio: 138.0, bytesPerSecond: 3200000, isAnomaly: true },
      { time: '13:42', packetLength: 64, flowDurationMs: 2, reconstructionLoss: 0.89, anomalyThreshold: 0.25, synAckRatio: 120.0, bytesPerSecond: 2800000, isAnomaly: true }
    ],
    shapFeatures: [
      { featureName: 'Extreme Autoencoder Reconstruction Error', featureValue: '0.942 Loss (Threshold: 0.250)', shapValue: 0.45, description: 'Unsupervised Autoencoder failed to compress high-dimensional flow structure due to anomalous packet distribution', category: 'temporal' },
      { featureName: 'Anomalous SYN/ACK Ratio Spike', featureValue: '142:1 SYN-to-ACK', shapValue: 0.35, description: 'Massive volume of half-open TCP SYN handshakes without standard ACK completion', category: 'behavioral' },
      { featureName: 'Sustained Temporal Traffic Burst (LSTM)', featureValue: '3.4 MB/s per flow', shapValue: 0.20, description: 'LSTM sequence memory detected continuous non-fluctuating packet transmission pattern', category: 'temporal' }
    ],
    summary: 'Severe Volumetric SYN Flood DDoS attack captured in real-time. Unsupervised Autoencoder reconstruction error surged to 0.942 (nearly 4x standard threshold) with a SYN/ACK ratio of 142:1.'
  },
  'pcap_normal_office.pcap': {
    id: 'NET-2026-102',
    captureSource: 'eth0_office_lan.pcap',
    totalPackets: 45200,
    flowDuration: '45m 00s',
    verdict: 'Normal Traffic',
    predictedAttackType: 'Benign',
    riskScore: 5,
    autoencoderReconstructionError: 0.065,
    anomalyThreshold: 0.250,
    lstmTemporalAlertScore: 4.2,
    topSourceIps: [
      { ip: '192.168.1.104', count: 18200, geo: 'Internal Host / Workstation-A', blocked: false },
      { ip: '192.168.1.1', count: 12400, geo: 'Default Gateway Router', blocked: false }
    ],
    topTargetPorts: [
      { port: 443, service: 'HTTPS', flag: 'Normal TLS Handshake' },
      { port: 53, service: 'DNS', flag: 'Standard UDP Query' }
    ],
    flowTimeline: [
      { time: '13:00', packetLength: 512, flowDurationMs: 140, reconstructionLoss: 0.05, anomalyThreshold: 0.25, synAckRatio: 1.01, bytesPerSecond: 24000, isAnomaly: false },
      { time: '13:10', packetLength: 1024, flowDurationMs: 220, reconstructionLoss: 0.07, anomalyThreshold: 0.25, synAckRatio: 1.00, bytesPerSecond: 38000, isAnomaly: false },
      { time: '13:20', packetLength: 850, flowDurationMs: 180, reconstructionLoss: 0.06, anomalyThreshold: 0.25, synAckRatio: 1.02, bytesPerSecond: 31000, isAnomaly: false },
      { time: '13:30', packetLength: 420, flowDurationMs: 95, reconstructionLoss: 0.05, anomalyThreshold: 0.25, synAckRatio: 1.01, bytesPerSecond: 18000, isAnomaly: false }
    ],
    shapFeatures: [
      { featureName: 'Standard Flow Reconstruction Loss', featureValue: '0.065 (Well below 0.250)', shapValue: -0.55, description: 'Packet flow distributions closely follow standard enterprise network baseline', category: 'temporal' },
      { featureName: 'Balanced TCP Handshake Ratio', featureValue: '1:1 SYN/ACK', shapValue: -0.35, description: 'Every connection initiation completes full 3-way TCP handshake cleanly', category: 'behavioral' }
    ],
    summary: 'Standard benign office telemetry. Traffic conforms strictly to learned normal baseline autoencoder distribution.'
  }
};

export const SAMPLE_MULTI_VECTOR_CAMPAIGN: MultiVectorAttackChain = {
  id: 'INC-2026-386',
  title: 'Operation DarkVortex (Targeted Multi-Vector APT Campaign)',
  campaignName: 'APT-29 / CozyBear Pattern Variant',
  overallThreatScore: 95,
  status: 'Active Incident',
  startTime: '2026-09-18 13:42:10 UTC',
  narrative: 'Cross-Vector Telemetry Correlation has linked 4 disparate security events across Email, URL, File Executable, and Network domains into a unified multi-stage attack campaign targeting Workstation-A (192.168.1.104).',
  recommendedPlaybook: 'PLAYBOOK-APT-CRITICAL-CONTAINMENT',
  nodes: [
    {
      id: 'NODE-1',
      vector: 'Email',
      title: 'Vector 1: Spear-Phishing Ingestion',
      description: 'Spoofed email received from finance-desk@payroll-update-gehu-corp.net with SPF/DMARC failure and high psychological urgency cues.',
      timestamp: '13:42:10 UTC',
      severity: 'Elevated',
      relatedArtifact: 'urgent_payroll_wire.eml',
      status: 'Correlated'
    },
    {
      id: 'NODE-2',
      vector: 'URL',
      title: 'Vector 2: Malicious URL Click & Redirect',
      description: 'Host clicked embedded link to secure-login-microsoft365.account-verify.online, triggering credential harvesting stager.',
      timestamp: '13:43:02 UTC',
      severity: 'Critical',
      relatedArtifact: 'http://secure-login-microsoft365.account-verify.online/...',
      status: 'Correlated'
    },
    {
      id: 'NODE-3',
      vector: 'Malware',
      title: 'Vector 3: Secondary Executable Dropper Execution',
      description: 'Downloaded invoice_payment_2026.exe executed in sandbox. CNN-LSTM detected memory injection & shadow copy deletion routines.',
      timestamp: '13:44:18 UTC',
      severity: 'Critical',
      relatedArtifact: 'invoice_payment_2026.exe (SHA256: 9f86d08...)',
      status: 'Detected'
    },
    {
      id: 'NODE-4',
      vector: 'Network',
      title: 'Vector 4: C2 Communication & Volumetric Anomaly',
      description: 'Autoencoder detected high reconstruction error (0.942) with outbound beaconing to IP 185.220.101.5 on port 8443.',
      timestamp: '13:45:00 UTC',
      severity: 'Critical',
      relatedArtifact: '185.220.101.5:8443 (DDoS / C2 Beacon)',
      status: 'Detected'
    }
  ]
};

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-386-01',
    timestamp: '13:45:00 UTC',
    vector: 'Multi-Vector',
    severity: 'Critical',
    title: 'Multi-Stage APT Campaign Correlated across 4 Vectors',
    description: 'Email -> URL -> Malware Execution -> C2 Beaconing on Workstation-A',
    riskScore: 95,
    source: 'Central Controller Orchestrator',
    status: 'Investigating'
  },
  {
    id: 'ALT-386-02',
    timestamp: '13:44:18 UTC',
    vector: 'Malware',
    severity: 'Critical',
    title: 'Ransomware Payload Detected (CNN-LSTM Hybrid)',
    description: 'invoice_payment_2026.exe flagged for process injection and shadow copy wiping',
    riskScore: 94,
    source: 'Malware Engine (CNN-LSTM)',
    status: 'Unresolved'
  },
  {
    id: 'ALT-386-03',
    timestamp: '13:43:02 UTC',
    vector: 'URL',
    severity: 'Elevated',
    title: 'Phishing Credential Harvester URL Blocked',
    description: 'Dual-Path classifier identified Microsoft brand impersonation on .online TLD',
    riskScore: 92,
    source: 'URL Classifier (LightGBM + DistilBERT)',
    status: 'Unresolved'
  },
  {
    id: 'ALT-386-04',
    timestamp: '13:42:10 UTC',
    vector: 'Email',
    severity: 'Elevated',
    title: 'Spear-Phishing Inbound Mail Quarantined',
    description: 'Sender SPF/DMARC failed, 96/100 urgency score detected by NLP analyzer',
    riskScore: 89,
    source: 'Email Filtering Gateway',
    status: 'Unresolved'
  },
  {
    id: 'ALT-386-05',
    timestamp: '13:36:00 UTC',
    vector: 'Network',
    severity: 'Critical',
    title: 'Volumetric SYN Flood Anomaly Detected',
    description: 'Unsupervised Autoencoder reconstruction loss surged to 0.942 (Threshold 0.250)',
    riskScore: 96,
    source: 'Spatiotemporal NIDS (AE-LSTM)',
    status: 'Investigating'
  }
];

export const INCIDENT_PLAYBOOKS: IncidentPlaybook[] = [
  {
    id: 'PLAYBOOK-APT-CRITICAL-CONTAINMENT',
    title: 'Multi-Vector APT Containment & Isolation Protocol',
    threatType: 'Multi-Stage Phishing + Ransomware Dropper + C2 Exfiltration',
    severity: 'Critical',
    triggerCondition: 'Unified Threat Score >= 81 across multiple vectors',
    steps: [
      {
        stepNumber: 1,
        title: 'Isolate Host from Local Subnet',
        command: 'Set-NetIPInterface -InterfaceAlias "Ethernet0" -DHCP Disabled\n# Or disconnect via EDR API endpoint',
        description: 'Sever local area network connectivity for Workstation-A (192.168.1.104) to prevent lateral SMB/WMI propagation.',
        status: 'pending'
      },
      {
        stepNumber: 2,
        title: 'Block Egress to Adversary C2 IP at Perimeter Firewall',
        command: 'sudo iptables -A OUTPUT -d 185.220.101.5 -j DROP\nsudo iptables -A FORWARD -d 185.220.101.5 -j DROP',
        description: 'Drop all outbound packets destined for C2 server 185.220.101.5 on ports 80, 443, and 8443.',
        status: 'pending'
      },
      {
        stepNumber: 3,
        title: 'Kill Injected Process & Terminate Remote Threads',
        command: 'taskkill /F /IM invoice_payment_2026.exe\ntaskkill /PID 1044 /F',
        description: 'Terminate the rogue malware process and infected hollowed process handle.',
        status: 'pending'
      },
      {
        stepNumber: 4,
        title: 'Quarantine Malicious Executable Hash in EDR Registry',
        command: 'New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Safer\\CodeIdentifiers\\0\\Hashes\\9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" -Force',
        description: 'Enforce enterprise-wide AppLocker / Software Restriction hash block for SHA256.',
        status: 'pending'
      },
      {
        stepNumber: 5,
        title: 'Purge Phishing Mail from All Inboxes & Revoke Active Session Tokens',
        command: 'Search-Mailbox -Identity * -SearchQuery "Subject:\'URGENT: Immediate Account Suspension\'" -DeleteContent\nRevoke-AzureADUserAllRefreshToken -ObjectId "hrithik.raj@gehu.ac.in"',
        description: 'Remove phishing lures from all user mailboxes and force credential token refresh.',
        status: 'pending'
      }
    ],
    iocs: [
      { type: 'SHA256', value: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', description: 'invoice_payment_2026.exe Ransomware Binary' },
      { type: 'IP', value: '185.220.101.5', description: 'External C2 Server & Staging Host' },
      { type: 'Domain', value: 'secure-login-microsoft365.account-verify.online', description: 'Credential Harvester Phishing Domain' },
      { type: 'Email', value: 'finance-desk@payroll-update-gehu-corp.net', description: 'Spoofed BEC Attacker Origin' }
    ]
  },
  {
    id: 'PLAYBOOK-DOS-MITIGATION',
    title: 'Automated Volumetric DDoS Mitigation Rule',
    threatType: 'TCP SYN Flood & Bandwidth Saturation',
    severity: 'Critical',
    triggerCondition: 'Autoencoder Reconstruction Loss > 0.60 & SYN/ACK Ratio > 20:1',
    steps: [
      {
        stepNumber: 1,
        title: 'Enable Kernel SYN Cookies',
        command: 'sysctl -w net.ipv4.tcp_syncookies=1\nsysctl -w net.ipv4.tcp_max_syn_backlog=4096',
        description: 'Activate SYN flood protection in OS network stack to prevent connection pool exhaustion.',
        status: 'pending'
      },
      {
        stepNumber: 2,
        title: 'Rate-Limit Inbound TCP Connections',
        command: 'iptables -A INPUT -p tcp --syn -m limit --limit 20/s --limit-burst 50 -j ACCEPT\niptables -A INPUT -p tcp --syn -j DROP',
        description: 'Throttle high-rate connection bursts at edge interface.',
        status: 'pending'
      }
    ],
    iocs: [
      { type: 'IP', value: '185.220.101.5', description: 'High-volume attack reflector' },
      { type: 'IP', value: '194.26.29.112', description: 'Botnet source IP' }
    ]
  }
];

import { pool } from './pool.js';

const FACULTY_IDS = {
  kalaivani: 'a1111111-1111-4111-8111-111111111001',
  pragadeesh: 'a1111111-1111-4111-8111-111111111002',
  priyanka: 'a1111111-1111-4111-8111-111111111003',
  valarmathie: 'a1111111-1111-4111-8111-111111111004',
  indumathi: 'a1111111-1111-4111-8111-111111111005',
  muthukumar: 'a1111111-1111-4111-8111-111111111006',
} as const;

type MentorKey = keyof typeof FACULTY_IDS;

const MENTOR_NAMES: Record<MentorKey, string> = {
  kalaivani: 'Dr.A.Kalaivani',
  pragadeesh: 'Mr.M.Pragadeesh',
  priyanka: 'Mrs.D.Priyanka',
  valarmathie: 'Dr.P.Valarmathie',
  indumathi: 'Mrs.K.Indumathi',
  muthukumar: 'Dr.B.Muthukumar',
};

/** Teams with pre-assigned mentor and project topic (Titles 1–16) */
const assignedTeams: { team_id: string; mentorKey: MentorKey; projectNum: number }[] = [
  { team_id: '27A03', mentorKey: 'kalaivani', projectNum: 1 },
  { team_id: '27A04', mentorKey: 'pragadeesh', projectNum: 2 },
  { team_id: '27A05', mentorKey: 'priyanka', projectNum: 3 },
  { team_id: '27A08', mentorKey: 'kalaivani', projectNum: 4 },
  { team_id: '27A12', mentorKey: 'pragadeesh', projectNum: 5 },
  { team_id: '27A19', mentorKey: 'valarmathie', projectNum: 6 },
  { team_id: '27A22', mentorKey: 'kalaivani', projectNum: 7 },
  { team_id: '27A25', mentorKey: 'indumathi', projectNum: 8 },
  { team_id: '27B01', mentorKey: 'pragadeesh', projectNum: 9 },
  { team_id: '27B09', mentorKey: 'priyanka', projectNum: 10 },
  { team_id: '27C02', mentorKey: 'kalaivani', projectNum: 11 },
  { team_id: '27C13', mentorKey: 'kalaivani', projectNum: 12 },
  { team_id: '27C19', mentorKey: 'priyanka', projectNum: 13 },
  { team_id: '27D02', mentorKey: 'muthukumar', projectNum: 14 },
  { team_id: '27D10', mentorKey: 'muthukumar', projectNum: 15 },
  { team_id: '27D27', mentorKey: 'valarmathie', projectNum: 16 },
];

function projectId(num: number) {
  return `c3333333-3333-4333-8333-333333333${String(num).padStart(3, '0')}`;
}

function cleanProjectTitle(title: string) {
  return title.replace(/^Title\d+\s*-\s*/i, '').trim();
}

async function seed() {
  await pool.query('DELETE FROM allocations');
  await pool.query('DELETE FROM teams');
  await pool.query('DELETE FROM projects');
  await pool.query('DELETE FROM faculty');

  await pool.query(
    `INSERT INTO faculty (id, faculty_id, name, email, password_hash, department) VALUES
      ($1, 'FAC001', $2, 'kalaivani@college.edu', 'faculty123', 'Computer Science'),
      ($3, 'FAC002', $4, 'pragadeesh@college.edu', 'faculty123', 'Computer Science'),
      ($5, 'FAC003', $6, 'priyanka@college.edu', 'faculty123', 'Computer Science'),
      ($7, 'FAC004', $8, 'valarmathie@college.edu', 'faculty123', 'Computer Science'),
      ($9, 'FAC005', $10, 'indumathi@college.edu', 'faculty123', 'Computer Science'),
      ($11, 'FAC006', $12, 'muthukumar@college.edu', 'faculty123', 'Computer Science')`,
    [
      FACULTY_IDS.kalaivani,
      MENTOR_NAMES.kalaivani,
      FACULTY_IDS.pragadeesh,
      MENTOR_NAMES.pragadeesh,
      FACULTY_IDS.priyanka,
      MENTOR_NAMES.priyanka,
      FACULTY_IDS.valarmathie,
      MENTOR_NAMES.valarmathie,
      FACULTY_IDS.indumathi,
      MENTOR_NAMES.indumathi,
      FACULTY_IDS.muthukumar,
      MENTOR_NAMES.muthukumar,
    ]
  );

  const mentorByProjectNum = new Map(
    assignedTeams.map((entry) => [
      entry.projectNum,
      { guide: MENTOR_NAMES[entry.mentorKey], facultyId: FACULTY_IDS[entry.mentorKey] },
    ])
  );

  const projects = [
    [
      'c3333333-3333-4333-8333-333333333001',
      'Title1 - Optimized Multi-Agent Deep Learning Framework for Lung Cancer Image Retrieval Using Medical Imaging Data',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333002',
      'Title2 - An Adaptive Reinforcement Learning–Based Heap Optimization Framework for Robust Medical Image Diagnosis and Prediction (ARL-HBO)',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333003',
      'Title3 - Fuzzy-Based Multi-Agent System In STEM Education For Video, Audio, Read/Write, Kinesthetic And Medical Image Learning Environment (FBMS-VARK)',
      'Multi-Agent System'
    ],
    [
      'c3333333-3333-4333-8333-333333333004',
      'Title4 - Real-Time Schizophrenia Diagnosis using Liquid Neural Networks: A GRU-Enhanced Approach for EEG Signal Analysis',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333005',
      'Title5 - Prediction Of Drug Dosage Of Diabetic Patients Based On Ontology Mapping And Deep Learning Models',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333006',
      'Title6 - Patient risk identification using AI',
      'AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333007',
      'Title7 - Personalized Healthcare Recommendations Using Large Language Models',
      'LLM'
    ],
    [
      'c3333333-3333-4333-8333-333333333008',
      'Title8 - Autonomous Software Development Framework Using Multi-Agent Generative AI',
      'Multi-Agent System'
    ],
    [
      'c3333333-3333-4333-8333-333333333009',
      'Title9 - Generative AI-Based Literature Review and Knowledge Synthesis System',
      'Gen AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333010',
      'Title10 - Generative AI-Based Malware Detection and Classification',
      'Cyber Security'
    ],
    [
      'c3333333-3333-4333-8333-333333333011',
      'Title11 - Privacy-Preserving Generative AI for Cybersecurity Applications',
      'Cyber Security'
    ],
    [
      'c3333333-3333-4333-8333-333333333012',
      'Title12 - Smart Public Facility Cleanliness Monitoring System',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333013',
      'Title13 - Water Consumption Forecasting and Conservation Analytics',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333014',
      'Title14 - Women Safety Intelligence Platform with Safe Route Recommendation',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333015',
      'Title15 - AI-Enabled Energy Consumption Optimizer and Carbon Footprint Estimation',
      'AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333016',
      'Title16 - AI-Powered Digital Accessibility Auditor of Websites for Disabled (Challenged) Users',
      'AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333017',
      'Title17 - Generative AI-Powered Cloud Security Assistant for Real-Time Threat Analysis',
      'AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333018',
      'Title18 - Machine Learning-Based Ransomware Detection and Recovery System for Cloud Storage',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333019',
      'Title19 - AI-Based Multi-Cloud Security Risk Assessment and Compliance Monitoring Framework',
      'AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333020',
      'Title20 - Intelligent Insider Threat Detection in Cloud Environments Using Deep Learning',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333021',
      'Title21 - Green AI-Based Security Resource Optimization in Cloud Data Centers',
      'AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333022',
      'Title22 - AI-Driven Unified Data Platform for Oceanographic, Fisheries, and Molecular Biodiversity Insights',
      'Gen AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333023',
      'Title23 - Smart Waste Segregation and Recycling System',
      'AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333024',
      'Title24 - AI-Based Rockfall Prediction and Alert System for Open-Pit Mines',
      'AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333025',
      'Title25 - LunaBot: Autonomous Navigation of Robot for Lunar Habitats',
      'AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333026',
      'Title26 - Neural Net Based Android Application for Real-Time Fish Catch Identification, Health, and Volume Estimation',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333027',
      'Title27 - AI-Powered Smart Campus Energy Management',
      'IoT and Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333028',
      'Title28 - AI-Enabled Industrial Safety Monitoring System',
      'IoT and Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333029',
      'Title29 - AI-Powered Driver Drowsiness Detection and Accident Prevention System',
      'IoT and Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333030',
      'Title30 - IoT-Based Smart Classroom Analytics System',
      'IoT and Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333031',
      'Title31 - AI-Powered COVID-19 and Heart Disease Relativeness Measurement System',
      'IoT and Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333032',
      'Title32 - AI-Based Adaptive Examination Monitoring System with Behavioral Anomaly Detection',
      'AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333033',
      'Title33 - Self-Learning Smart Traffic Optimization System Using Reinforcement Learning and IoT',
      'AI & IoT'
    ],
    [
      'c3333333-3333-4333-8333-333333333034',
      'Title34 - Context-Aware Cybersecurity Shield for IoT Networks',
      'Cybersecurity'
    ],
    [
      'c3333333-3333-4333-8333-333333333035',
      'Title35 - Intelligent Phishing and Deepfake Detection Engine for Real-Time Communication Platforms',
      'Cybersecurity'
    ],
    [
      'c3333333-3333-4333-8333-333333333036',
      'Title36 - Offline Recovery Framework for Lost Mobile Devices in Zero-Power and No-Network Conditions',
      'Network Security / Cloud Computing'
    ],
    [
      'c3333333-3333-4333-8333-333333333037',
      'Title37 - AI-Driven Detection of Zero-Day Attacks in Cloud Environments',
      'Network Security / Cloud Computing'
    ],
    [
      'c3333333-3333-4333-8333-333333333038',
      'Title38 - AR/VR Rehabilitation System for Stroke Patients',
      'AR/VR'
    ],
    [
      'c3333333-3333-4333-8333-333333333039',
      'Title39 - AI-Powered AR Navigation and Obstacle Detection System for Visually Impaired Individuals',
      'AR/VR'
    ],
    [
      'c3333333-3333-4333-8333-333333333040',
      'Title40 - A Real-Time Threat Intelligence Platform for Cloud Security',
      'Network Security / Cloud Computing'
    ],
    [
      'c3333333-3333-4333-8333-333333333041',
      'Title41 - Analysis of Original Photos, Images over AI Generated; A Comparative Analysis for Identification of Fake Percentage Generated',
      'AI Analytics and Security'
    ],
    [
      'c3333333-3333-4333-8333-333333333042',
      'Title42 - Blockchain Platform for Secure Trade of Agricultural Products',
      'Blockchain and Deep Learning with IoT'
    ],
    [
      'c3333333-3333-4333-8333-333333333043',
      'Title43 - An Effective Prediction Framework for Both Yield and Price of Agricultural Products in Tamil Nadu Using Deep Learning and AI-Based Analytics',
      'Deep Learning and AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333044',
      'Title44 - A Framework for Prediction of Tomato Cultivation Seasons and Districts in Tamil Nadu and Analyze the Quantity of Production in a Year Using AI-Based Decision Model',
      'Deep Learning and AI, Time GAN'
    ],
    [
      'c3333333-3333-4333-8333-333333333045',
      'Title45 - Image-Based Animal Type Classification for Cattle and Buffaloes',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333046',
      'Title46 - Intelligent Mobile Safety Companion for Mine Workers',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333047',
      'Title47 - Early Detection of Wheat Diseases',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333048',
      'Title48 - One-Stop Personalized Career & Education Advisor',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333049',
      'Title49 - AI-Powered Campus Digital Twin and Virtual Experience Platform',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333050',
      'Title50 - Analyzing the Performance of Diverse Deep Learning Architectures for Weather Prediction',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333051',
      'Title51 - A Machine Learning Model for the Early Prediction of Cardiovascular Disease in Patients',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333052',
      'Title52 - Fraud Detection in Decentralized Finance (DeFi) Transactions Using ML and Smart Contracts',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333053',
      'Title53 - Phishing URL Detection Using Machine Learning',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333054',
      'Title54 - Integrating Emotion Detection with Sentiment Analysis Using Visual and Text Content',
      'NLP'
    ],
    [
      'c3333333-3333-4333-8333-333333333055',
      'Title55 - Quantum-Enhanced Climate Health Risk Prediction System for Heatwave and Disease Surveillance',
      'Climate Change and Public Health'
    ],
    [
      'c3333333-3333-4333-8333-333333333056',
      'Title56 - Quantum-Assisted Climate Resilience Assessment and Smart Crop Recommendation System Under Future Climate Scenarios',
      'Climate Change and Agriculture'
    ],
    [
      'c3333333-3333-4333-8333-333333333057',
      'Title57 - Hybrid Quantum Deep Learning Framework for Multi-Hazard Climate Early Warning and Risk Forecasting',
      'Climate Change and Early Warning Prediction'
    ],
    [
      'c3333333-3333-4333-8333-333333333058',
      'Title58 - Quantum Multi-Agent Decision Support System for Climate Adaptation and Mitigation Strategy Planning',
      'Climate Adaptation and Mitigation'
    ],
    [
      'c3333333-3333-4333-8333-333333333059',
      'Title59 - CareSyncBlock: Privacy-Preserving Federated Blockchain Model for Healthcare WSN Communication',
      'Wireless Sensor Networks + Cybersecurity + Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333060',
      'Title60 - Digital Twin-Assisted Deep Reinforcement Learning with Lightweight Blockchain and DNA-Chaotic Encryption for Secure Medical Image Transmission in IoT-WSNs',
      'Artificial Intelligence (AI) / Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333061',
      'Title61 - MediChainNet: A PBFT-Enabled Blockchain with LSTM-Based WSN Framework for Secure Healthcare Monitoring',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333062',
      'Title62 - A Hybrid Machine Learning and Deep Learning Approach for Automated Underwater Marine Species Classification',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333063',
      'Title63 - AI-Based Smart Waste Segregation System Using Computer Vision and Explainable AI',
      'Artificial Intelligence / Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333064',
      'Title64 - Federated Learning-Based Crop Disease Detection for Smart Agriculture',
      'Machine Learning / Image Processing'
    ],
    [
      'c3333333-3333-4333-8333-333333333065',
      'Title65 - Real-Time Industrial Safety Monitoring Using Computer Vision',
      'Artificial Intelligence (AI) / Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333066',
      'Title66 - Smart Medical Image Analysis for Early Disease Prediction',
      'Machine Learning / Image Processing'
    ],
    [
      'c3333333-3333-4333-8333-333333333067',
      'Title67 - Explainable Machine Learning Framework for Early Heart Disease Risk Prediction',
      'Machine Learning / Image Processing'
    ],
    [
      'c3333333-3333-4333-8333-333333333068',
      'Title68 - Machine Learning-Based Smart Crop Yield Prediction and Recommendation System',
      'Machine Learning, Agriculture Analytics'
    ],
    [
      'c3333333-3333-4333-8333-333333333069',
      'Title69 - IoT-Based Smart Waste Management System with Fill-Level Prediction',
      'IoT'
    ],
    [
      'c3333333-3333-4333-8333-333333333070',
      'Title70 - IoT-Based Smart Water Quality Monitoring and Pollution Alert System',
      'IoT'
    ],
    [
      'c3333333-3333-4333-8333-333333333071',
      'Title71 - Transformer-Based Personalized Learning Recommendation System for Children with Special Needs Using Deep Reinforcement Learning',
      'Artificial Intelligence in Education'
    ],
    [
      'c3333333-3333-4333-8333-333333333072',
      'Title72 - Graph Neural Network-Based Gamified Adaptive Learning Platform for Cognitive Skill Enhancement of Children with Special Needs',
      'Educational Technology'
    ],
    [
      'c3333333-3333-4333-8333-333333333073',
      'Title73 - Explainable Learning Style Prediction System Using Random Forest and SHAP Explainable AI for Children with Special Needs',
      'Explainable Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333074',
      'Title74 - Multi-Level Explainable Educational Assistant Using Large Language Models and Neuro-Symbolic Explainable AI',
      'Explainable AI and Intelligent Tutoring Systems'
    ],
    [
      'c3333333-3333-4333-8333-333333333075',
      'Title75 - Explainable Plant Disease Detection in Real Farmland Environments',
      'Explainable AI, Computer Vision'
    ],
    [
      'c3333333-3333-4333-8333-333333333076',
      'Title76 - Deep Learning-Based Intrusion Detection for IoT Networks',
      'Deep Learning, Cybersecurity'
    ],
    [
      'c3333333-3333-4333-8333-333333333077',
      'Title77 - Automated Diabetic Retinopathy Screening',
      'Medical Image Analysis, Computer Vision'
    ],
    [
      'c3333333-3333-4333-8333-333333333078',
      'Title78 - Smart Traffic Congestion Prediction for Sustainable Cities',
      'Artificial Intelligence, Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333079',
      'Title79 - Smart Exam Hall Entry System Using RFID for Real-Time Attendance Tracking of Students',
      'IoT'
    ],
    [
      'c3333333-3333-4333-8333-333333333080',
      'Title80 - AI-Based Cyber Threat Detection and Network Intrusion Prevention System',
      'Artificial Intelligence with Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333081',
      'Title81 - Artificial Neural Network for Stock Market Trend Prediction',
      'Neural Networks'
    ],
    [
      'c3333333-3333-4333-8333-333333333082',
      'Title82 - Machine Learning-Based Credit Card Fraud Detection System',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333083',
      'Title83 - Predictive Maintenance of Industrial Equipment Using Machine Learning',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333084',
      'Title84 - AI-Powered Resume Screening and Candidate Ranking System',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333085',
      'Title85 - Deep Learning-Based Fake News Detection and Verification System',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333086',
      'Title86 - Smart Energy Consumption Prediction and Optimization System',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333087',
      'Title87 - Multilingual Chatbot for Citizen Services',
      'Natural Language Processing (NLP)'
    ],
    [
      'c3333333-3333-4333-8333-333333333088',
      'Title88 - Real-Time Face Mask Detection and Compliance Monitoring',
      'Computer Vision'
    ],
    [
      'c3333333-3333-4333-8333-333333333089',
      'Title89 - AI-Based Smart Attendance Management System',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333090',
      'Title90 - Predictive Analytics for Student Academic Performance',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333091',
      'Title91 - AI-Based Network Anomaly Detection and Threat Intelligence Framework',
      'Cybersecurity'
    ],
    [
      'c3333333-3333-4333-8333-333333333092',
      'Title92 - Blockchain-Based Secure Academic Certificate Verification System',
      'Blockchain'
    ],
    [
      'c3333333-3333-4333-8333-333333333093',
      'Title93 - AI-Powered Smart Healthcare Appointment and Recommendation System',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333094',
      'Title94 - Real-Time Vehicle Detection and Traffic Monitoring System',
      'Computer Vision'
    ],
    [
      'c3333333-3333-4333-8333-333333333095',
      'Title95 - Customer Churn Prediction Using Machine Learning Techniques',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333096',
      'Title96 - Speech Emotion Recognition Using Deep Learning',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333097',
      'Title97 - AI-Based Disaster Response and Emergency Resource Allocation System',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333098',
      'Title98 - Smart Parking Management System Using Computer Vision',
      'Computer Vision'
    ],
    [
      'c3333333-3333-4333-8333-333333333099',
      'Title99 - Loan Eligibility Prediction and Risk Assessment Framework',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333100',
      'Title100 - Automated Question Answering System Using Large Language Models',
      'Natural Language Processing'
    ],
    [
      'c3333333-3333-4333-8333-333333333101',
      'Title101 - Deep Learning-Based Crop Disease Identification System',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333102',
      'Title102 - Intelligent Tourism Recommendation and Planning Assistant',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333103',
      'Title103 - Smart Air Quality Monitoring and Prediction System',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333104',
      'Title104 - Automated Road Damage Detection and Classification',
      'Computer Vision'
    ],
    [
      'c3333333-3333-4333-8333-333333333105',
      'Title105 - AI-Driven Security Operations Center (SOC) Assistant',
      'Cybersecurity'
    ],
    [
      'c3333333-3333-4333-8333-333333333106',
      'Title106 - Intelligent Public Transport Route Optimization System',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333107',
      'Title107 - Predictive Analytics Framework for Retail Demand Forecasting',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333108',
      'Title108 - Deep Learning-Based Human Activity Recognition System',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333109',
      'Title109 - Smart Water Distribution and Leakage Detection System',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333110',
      'Title110 - Machine Learning Framework for Insurance Claim Fraud Detection',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333111',
      'Title111 - AI-Powered Smart Surveillance and Suspicious Activity Detection',
      'Computer Vision'
    ],
    [
      'c3333333-3333-4333-8333-333333333112',
      'Title112 - Intelligent Legal Document Summarization System',
      'Natural Language Processing'
    ],
    [
      'c3333333-3333-4333-8333-333333333113',
      'Title113 - AI-Based Mental Health Support and Monitoring Platform',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333114',
      'Title114 - Predictive Analytics for Hospital Resource Allocation',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333115',
      'Title115 - Deep Learning-Based Medical Diagnosis Support System',
      'Deep Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333116',
      'Title116 - AI-Driven Smart Farming Advisory Platform',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333117',
      'Title117 - Intelligent Malware Analysis and Classification System',
      'Cybersecurity'
    ],
    [
      'c3333333-3333-4333-8333-333333333118',
      'Title118 - Predictive Supply Chain Optimization Using Machine Learning',
      'Machine Learning'
    ],
    [
      'c3333333-3333-4333-8333-333333333119',
      'Title119 - Automated Waste Classification Using Image Processing',
      'Computer Vision'
    ],
    [
      'c3333333-3333-4333-8333-333333333120',
      'Title120 - AI-Powered Smart City Management Dashboard',
      'Artificial Intelligence'
    ],
    [
      'c3333333-3333-4333-8333-333333333121',
      'Title121 - Smart Citizen Grievance Management System',
      'Social Welfare - AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333122',
      'Title122 - Women Safety Monitoring and Emergency Alert System',
      'Women Safety - AI'
    ],
    [
      'c3333333-3333-4333-8333-333333333123',
      'Title123 - Predictive Women Safety and Emergency Response System Using Multimodal AI',
      'Women Safety - AI,DL'
    ]
  ];

  for (const [id, title, domain] of projects) {
    const projectNum = parseInt(id.slice(-3), 10);
    const mentor = mentorByProjectNum.get(projectNum);
    const facultyGuide = mentor?.guide ?? 'Not Assigned';
    const createdBy = mentor?.facultyId ?? null;

    await pool.query(
      `INSERT INTO projects (id, title, domain, description, faculty_guide, max_teams, created_by)
       VALUES ($1, $2, $3, $4, $5, 1, $6)`,
      [id, title, domain, 'No description available.', facultyGuide, createdBy]
    );
  }

  const teamData = [
    // Batch A
    { team_id: '27A01', s1_name: 'Aadhi S', s1_roll: '2116231001001', s2_name: 'Gokul Raj G', s2_roll: '2116231001047' },
    { team_id: '27A02', s1_name: 'Aadithya B', s1_roll: '2116231001002', s2_name: 'Dhakshinya P I', s2_roll: '2116231001032' },
    { team_id: '27A06', s1_name: 'Abishek S', s1_roll: '2116231001006', s2_name: 'Aswin Muthukumar', s2_roll: '2116231001022' },
    { team_id: '27A07', s1_name: 'Adhithyan M', s1_roll: '2116231001007', s2_name: 'Dharshini C K', s2_roll: '2116231001034' },
    { team_id: '27A09', s1_name: 'Akshaya M', s1_roll: '2116231001009', s2_name: 'Archana A', s2_roll: '2116231001016' },
    { team_id: '27A10', s1_name: 'Alfred Dhanam P', s1_roll: '2116231001011', s2_name: 'Gowtham P L', s2_roll: '2116231001049' },
    { team_id: '27A11', s1_name: 'Ameen Basith K', s1_roll: '2116231001012', s2_name: 'Arun V', s2_roll: '2116231001018' },
    { team_id: '27A13', s1_name: 'Anushaa Maai T M', s1_roll: '2116231001015', s2_name: 'Hemaprabha S', s2_roll: '2116231001063' },
    { team_id: '27A14', s1_name: 'Arivazhagan R', s1_roll: '2116231001017', s2_name: 'Dineshwar S', s2_roll: '2116231001041' },
    { team_id: '27A15', s1_name: 'Asmitha Sree J A', s1_roll: '2116231001020', s2_name: 'Harini K', s2_roll: '2116231001054' },
    { team_id: '27A16', s1_name: 'Aswanth V R', s1_roll: '2116231001021', s2_name: 'Yeshwanth R', s2_roll: '2116231001901' },
    { team_id: '27A17', s1_name: 'Avinash V', s1_roll: '2116231001023', s2_name: 'Gowtham S', s2_roll: '2116231001050' },
    { team_id: '27A18', s1_name: 'Avishnavi P', s1_roll: '2116231001024', s2_name: 'Bhagya Lakshmi M', s2_roll: '2116231001025' },
    { team_id: '27A20', s1_name: 'Bharathkumar S', s1_roll: '2116231001028', s2_name: 'Faqrudeen Faizan Z', s2_roll: '2116231001042' },
    { team_id: '27A21', s1_name: 'Deepak k', s1_roll: '2116231001029', s2_name: 'Dinesh Kumar B', s2_roll: '2116231001039' },
    { team_id: '27A23', s1_name: 'Devadharshan S G', s1_roll: '2116231001031', s2_name: 'Dhiyanesh S', s2_roll: '2116231001036' },
    { team_id: '27A24', s1_name: 'Dhanush M', s1_roll: '2116231001033', s2_name: 'Hemanth C', s2_roll: '2116231001062' },
    { team_id: '27A26', s1_name: 'Dhuvarkesh H B', s1_roll: '2116231001037', s2_name: 'Furdeen F', s2_roll: '2116231001043' },
    { team_id: '27A27', s1_name: 'Dinesh S', s1_roll: '2116231001040', s2_name: 'Gobi Krishna J', s2_roll: '2116231001045' },
    { team_id: '27A28', s1_name: 'Giridharan D', s1_roll: '2116231001044', s2_name: 'Harish S', s2_roll: '2116231001057' },
    { team_id: '27A29', s1_name: 'Gokula Srinithi M', s1_roll: '2116231001048', s2_name: 'Harshitha S', s2_roll: '2116231001061' },
    { team_id: '27A30', s1_name: 'Hariharan M', s1_roll: '2116231001052', s2_name: 'Harisangaran S', s2_roll: '2116231001056' },
    { team_id: '27A31', s1_name: 'Hariprasanth P', s1_roll: '2116231001055', s2_name: 'Harishkumar M', s2_roll: '2116231001060' },
    { team_id: '27A32', s1_name: 'Harisha D', s1_roll: '2116231001058', s2_name: 'Harishini T', s2_roll: '2116231001059' },

    // Batch B
    { team_id: '27B02', s1_name: 'Jacitha R', s1_roll: '2116231001067', s2_name: 'Jayasri J', s2_roll: '2116231001074' },
    { team_id: '27B03', s1_name: 'Jai Akash S', s1_roll: '2116231001068', s2_name: 'Mukesh kumar K', s2_roll: '2116231001127' },
    { team_id: '27B04', s1_name: 'Jai Harish R', s1_roll: '2116231001069', s2_name: 'Mukesh R', s2_roll: '2116231001129' },
    { team_id: '27B05', s1_name: 'Janani G', s1_roll: '2116231001070', s2_name: 'Janani K', s2_roll: '2116231001071' },
    { team_id: '27B06', s1_name: 'Jasper Savio M', s1_roll: '2116231001072', s2_name: 'Jayabalaji S', s2_roll: '2116231001073' },
    { team_id: '27B07', s1_name: 'Jayasurya J', s1_roll: '2116231001075', s2_name: 'Madhumitha M', s2_roll: '2116231001104' },
    { team_id: '27B08', s1_name: 'Jegaeswaran A', s1_roll: '2116231001076', s2_name: 'Ganesh P', s2_roll: '2116231001065' },
    { team_id: '27B10', s1_name: 'Joshika M', s1_roll: '2116231001078', s2_name: 'Lakshmanan V S', s2_roll: '2116231001097' },
    { team_id: '27B11', s1_name: 'Joshika S', s1_roll: '2116231001079', s2_name: 'Lokeshwari S', s2_roll: '2116231001103' },
    { team_id: '27B12', s1_name: 'Joshua D', s1_roll: '2116231001080', s2_name: 'Kavitamizh kumaran A', s2_roll: '2116231001087' },
    { team_id: '27B13', s1_name: 'Juliet Roshan J', s1_roll: '2116231001081', s2_name: 'Mugunth B', s2_roll: '2116231001125' },
    { team_id: '27B14', s1_name: 'Kabil R S', s1_roll: '2116231001082', s2_name: 'Kailash T S', s2_roll: '2116231001083' },
    { team_id: '27B15', s1_name: 'Kanish Kumar M', s1_roll: '2116231001084', s2_name: 'Kesav Kumar S', s2_roll: '2116231001091' },
    { team_id: '27B16', s1_name: 'Karthipan G', s1_roll: '2116231001085', s2_name: 'Kiransurya C L S', s2_roll: '2116231001094' },
    { team_id: '27B17', s1_name: 'Kavipriya M A', s1_roll: '2116231001086', s2_name: 'Kishore J M', s2_roll: '2116231001096' },
    { team_id: '27B18', s1_name: 'Kavitha P', s1_roll: '2116231001088', s2_name: 'Lakshmipriya K', s2_roll: '2116231001098' },
    { team_id: '27B19', s1_name: 'Kavya Roshini M U', s1_roll: '2116231001089', s2_name: 'Meenakshi R', s2_roll: '2116231001111' },
    { team_id: '27B20', s1_name: 'Keerthi Haasan K', s1_roll: '2116231001090', s2_name: 'Monika K', s2_roll: '2116231001120' },
    { team_id: '27B21', s1_name: 'Kesavaraj R K', s1_roll: '2116231001092', s2_name: 'Lingesh C', s2_roll: '2116231001100' },
    { team_id: '27B22', s1_name: 'Kirankumar B', s1_roll: '2116231001093', s2_name: 'Mukesh M', s2_roll: '2116231001128' },
    { team_id: '27B23', s1_name: 'Kishore Asir Gunasekaran', s1_roll: '2116231001095', s2_name: 'Lavanya P', s2_roll: '2116231001099' },
    { team_id: '27B24', s1_name: 'Logeswaran K', s1_roll: '2116231001101', s2_name: 'Mugunthan S', s2_roll: '2116231001126' },
    { team_id: '27B25', s1_name: 'Lokesh R', s1_roll: '2116231001102', s2_name: 'Maharajan M', s2_roll: '2116231001105' },
    { team_id: '27B26', s1_name: 'Mahesh Babu R', s1_roll: '2116231001106', s2_name: 'Meiappan P', s2_roll: '2116231001113' },
    { team_id: '27B27', s1_name: 'Mahesh Kumar S', s1_roll: '2116231001107', s2_name: 'Manimaran D', s2_roll: '2116231001110' },
    { team_id: '27B28', s1_name: 'Manikandan K R', s1_roll: '2116231001109', s2_name: 'Mohammed Azarudeen S', s2_roll: '2116231001114' },
    { team_id: '27B29', s1_name: 'Megavarshini S', s1_roll: '2116231001112', s2_name: 'Monasree R', s2_roll: '2116231001116' },
    { team_id: '27B30', s1_name: 'Mohammed Fadil K', s1_roll: '2116231001115', s2_name: 'Mrigesh S', s2_roll: '2116231001123' },
    { team_id: '27B31', s1_name: 'Monesh M', s1_roll: '2116231001117', s2_name: 'Moniga K', s2_roll: '2116231001118' },
    { team_id: '27B32', s1_name: 'Monish S', s1_roll: '2116231001121', s2_name: 'Mahtab Alam A', s2_roll: '2116231001108' },
    { team_id: '27B33', s1_name: 'Mowlipriya V', s1_roll: '2116231001122', s2_name: 'Mruthul M', s2_roll: '2116231001124' },

    // Batch C
    { team_id: '27C01', s1_name: 'Muthu Varshine M', s1_roll: '2116231001302', s2_name: 'Ravilla Kavya Sree', s2_roll: '2116231001337' },
    { team_id: '27C03', s1_name: 'Narasimman M', s1_roll: '2116231001304', s2_name: 'Praveen Kumar V', s2_roll: '2116231001326' },
    { team_id: '27C04', s1_name: 'Naren E', s1_roll: '2116231001305', s2_name: 'Sahana R', s2_roll: '2116231001345' },
    { team_id: '27C05', s1_name: 'Naveen D', s1_roll: '2116231001306', s2_name: 'Shelva Akash R P', s2_roll: '2116231001365' },
    { team_id: '27C06', s1_name: 'Neeraj Balaji L', s1_roll: '2116231001307', s2_name: 'Pritesh kumar P K', s2_roll: '2116231001328' },
    { team_id: '27C07', s1_name: 'Nikitha P', s1_roll: '2116231001308', s2_name: 'Sangavi S', s2_roll: '2116231001352' },
    { team_id: '27C08', s1_name: 'Niraj S B', s1_roll: '2116231001309', s2_name: 'Raghu Bharathi K P', s2_roll: '2116231001332' },
    { team_id: '27C09', s1_name: 'Nishanth N S', s1_roll: '2116231001310', s2_name: 'Revanth Krishna S', s2_roll: '2116231001339' },
    { team_id: '27C10', s1_name: 'Nishanth P', s1_roll: '2116231001311', s2_name: 'Prasannarajan D', s2_roll: '2116231001323' },
    { team_id: '27C11', s1_name: 'Nithiya K', s1_roll: '2116231001313', s2_name: 'Oviya R', s2_roll: '2116231001314' },
    { team_id: '27C12', s1_name: 'Paraneshwari M', s1_roll: '2116231001315', s2_name: 'Sahara J G', s2_roll: '2116231001346' },
    { team_id: '27C14', s1_name: 'Nithin Kumar P B', s1_roll: '2116231001312', s2_name: 'Prashaant V', s2_roll: '2116231001324' },
    { team_id: '27C15', s1_name: 'Pradyumna G', s1_roll: '2116231001318', s2_name: 'Prakasu V', s2_roll: '2116231001319' },
    { team_id: '27C16', s1_name: 'pranav M', s1_roll: '2116231001320', s2_name: 'Sam Henry K', s2_roll: '2116231001348' },
    { team_id: '27C17', s1_name: 'Prasanna Moorthi.E', s1_roll: '2116231001321', s2_name: 'Sabarish R', s2_roll: '2116231001342' },
    { team_id: '27C18', s1_name: 'Prasanna Venkatesh V', s1_roll: '2116231001322', s2_name: 'Shakthi Sri P', s2_roll: '2116231001361' },
    { team_id: '27C20', s1_name: 'Praveen kumar P', s1_roll: '2116231001325', s2_name: 'Shaini T', s2_roll: '2116231001360' },
    { team_id: '27C21', s1_name: 'Priyadharshini K', s1_roll: '2116231001329', s2_name: 'Priyadharshini V', s2_roll: '2116231001330' },
    { team_id: '27C22', s1_name: 'Pushpa G', s1_roll: '2116231001331', s2_name: 'Samecha A', s2_roll: '2116231001349' },
    { team_id: '27C23', s1_name: 'Ravikulan J', s1_roll: '2116231001336', s2_name: 'Sanjay Sri S', s2_roll: '2116231001355' },
    { team_id: '27C24', s1_name: 'Ravi Raahul S R', s1_roll: '2116231001335', s2_name: 'Saiswetha M', s2_roll: '2116231001347' },
    { team_id: '27C25', s1_name: 'Renita Jasper', s1_roll: '2116231001338', s2_name: 'Hari Prasad S', s2_roll: '2116231001300' },
    { team_id: '27C26', s1_name: 'Rithvik Pranao J D', s1_roll: '2116231001340', s2_name: 'Sachin J', s2_roll: '2116231001343' },
    { team_id: '27C27', s1_name: 'Roshini G', s1_roll: '2116231001341', s2_name: 'Sanjala S', s2_roll: '2116231001353' },
    { team_id: '27C28', s1_name: 'Sachin K S', s1_roll: '2116231001344', s2_name: 'Saranraj A R', s2_roll: '2116231001357' },
    { team_id: '27C29', s1_name: 'Sandhiya S K', s1_roll: '2116231001350', s2_name: 'Shanthini C', s2_roll: '2116231001362' },
    { team_id: '27C30', s1_name: 'Sangari A C', s1_roll: '2116231001351', s2_name: 'Saravanan G', s2_roll: '2116231001358' },
    { team_id: '27C31', s1_name: 'Sanjay A', s1_roll: '2116231001354', s2_name: 'Shikin S', s2_roll: '2116231001366' },
    { team_id: '27C32', s1_name: 'Sanjeev Manickam N', s1_roll: '2116231001356', s2_name: 'Perrarasu A', s2_roll: '2116231001317' },
    { team_id: '27C33', s1_name: 'Sasmita R', s1_roll: '2116231001359', s2_name: 'Sharon Felicita S', s2_roll: '2116231001364' },
    { team_id: '27C34', s1_name: 'Sharmila E', s1_roll: '2116231001363', s2_name: 'Keerthanaa R', s2_roll: '2116231001301' },

    // Batch D
    { team_id: '27D01', s1_name: 'Shiyam P', s1_roll: '2116231001193', s2_name: 'Sudarsun P', s2_roll: '2116231001218' },
    { team_id: '27D03', s1_name: 'Shree kumaran S', s1_roll: '2116231001195', s2_name: 'Vigneshkumar S', s2_roll: '2116231001241' },
    { team_id: '27D04', s1_name: 'Shreenithi A', s1_roll: '2116231001196', s2_name: 'Suvathi D', s2_roll: '2116231001225' },
    { team_id: '27D05', s1_name: 'Shreenithi R B', s1_roll: '2116231001197', s2_name: 'Shruti P', s2_roll: '2116231001199' },
    { team_id: '27D06', s1_name: 'Shreya S', s1_roll: '2116231001198', s2_name: 'Yasaswini D', s2_roll: '2116231001252' },
    { team_id: '27D07', s1_name: 'Shyam Narayanan S', s1_roll: '2116231001200', s2_name: 'Sudharshan V', s2_roll: '2116231001221' },
    { team_id: '27D08', s1_name: 'Shylina A', s1_roll: '2116231001201', s2_name: 'Thenmozhi S', s2_roll: '2116231001232' },
    { team_id: '27D09', s1_name: 'Sitheswar K', s1_roll: '2116231001203', s2_name: 'Siva M', s2_roll: '2116231001204' },
    { team_id: '27D11', s1_name: 'Smurithi R', s1_roll: '2116231001206', s2_name: 'Sruthi S K', s2_roll: '2116231001216' },
    { team_id: '27D12', s1_name: 'Sowjanya D P', s1_roll: '2116231001207', s2_name: 'Sudharsan D', s2_roll: '2116231001220' },
    { team_id: '27D13', s1_name: 'Sriman Viyasen S J', s1_roll: '2116231001208', s2_name: 'Vishal S', s2_roll: '2116231001248' },
    { team_id: '27D14', s1_name: 'Srimathi B S', s1_roll: '2116231001209', s2_name: 'Srinithya A', s2_roll: '2116231001212' },
    { team_id: '27D15', s1_name: 'Srinath S', s1_roll: '2116231001210', s2_name: 'Vishal R', s2_roll: '2116231001247' },
    { team_id: '27D16', s1_name: 'Srinidhi J', s1_roll: '2116231001211', s2_name: 'Sruthi Varshni Vaidyanathan', s2_roll: '2116231001217' },
    { team_id: '27D17', s1_name: 'Sriram Ganesh M', s1_roll: '2116231001213', s2_name: 'Vishal T', s2_roll: '2116231001249' },
    { team_id: '27D18', s1_name: 'Sri Sanjana B', s1_roll: '2116231001214', s2_name: 'Vaishali S', s2_roll: '2116231001235' },
    { team_id: '27D19', s1_name: 'Sritharanika G K', s1_roll: '2116231001215', s2_name: 'Venisha M', s2_roll: '2116231001240' },
    { team_id: '27D20', s1_name: 'Sudhakar V', s1_roll: '2116231001219', s2_name: 'Tishna D', s2_roll: '2116231001233' },
    { team_id: '27D21', s1_name: 'Sujitha S', s1_roll: '2116231001223', s2_name: 'Varshini D', s2_roll: '2116231001237' },
    { team_id: '27D22', s1_name: 'Sumanth S', s1_roll: '2116231001224', s2_name: 'Vinith Kumar D N', s2_roll: '2116231001506' },
    { team_id: '27D23', s1_name: 'Tamilselvan E', s1_roll: '2116231001227', s2_name: 'Vignesh V', s2_roll: '2116231001242' },
    { team_id: '27D24', s1_name: 'Tharun Prasath A', s1_roll: '2116231001230', s2_name: 'Thulasidhar R', s2_roll: '2116231001505' },
    { team_id: '27D25', s1_name: 'Varnika S', s1_roll: '2116231001236', s2_name: 'Varshini S', s2_roll: '2116231001238' },
    { team_id: '27D26', s1_name: 'Vasanthu K', s1_roll: '2116231001239', s2_name: 'Vinoth M', s2_roll: '2116231001246' },
    { team_id: '27D28', s1_name: 'Viswagandan S K', s1_roll: '2116231001250', s2_name: 'Madesh U', s2_roll: '2116231001508' },
    { team_id: '27D29', s1_name: 'Yashwanth M', s1_roll: '2116231001253', s2_name: 'Yogesh Aravind A', s2_roll: '2116231001254' },
    { team_id: '27D30', s1_name: 'Yogesh V', s1_roll: '2116231001255', s2_name: 'Yokesh Raghul T', s2_roll: '2116231001256' }
  ];

  for (let i = 0; i < teamData.length; i++) {
    const t = teamData[i];
    const teamUuid = `b2222222-2222-4222-8222-222222222${String(i + 1).padStart(3, '0')}`;
    const s1_email = `${t.s1_roll}@college.edu`;
    const s2_email = `${t.s2_roll}@college.edu`;

    await pool.query(
      `INSERT INTO teams (
        id, team_id, team_name, password_hash, department,
        student1_name, student1_email, student1_roll_no, student1_department, student1_year, student1_semester, student1_section,
        student2_name, student2_email, student2_roll_no, student2_department, student2_year, student2_semester, student2_section,
        selected_project_id, selection_date
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19,
        $20, $21
      )`,
      [
        teamUuid, t.team_id, `Batch ${t.team_id}`, t.s1_roll, 'Information Technology',
        t.s1_name, s1_email, t.s1_roll, 'Information Technology', '4', '7', 'A',
        t.s2_name, s2_email, t.s2_roll, 'Information Technology', '4', '7', 'A',
        null, null
      ]
    );
  }

  console.log('Database seeded successfully.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Database seed failed:', err);
  process.exit(1);
});

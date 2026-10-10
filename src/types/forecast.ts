export type RegionId =
  | 'Chennai'
  | 'Mumbai'
  | 'Delhi'
  | 'Kolkata'
  | 'Hyderabad'
  | 'Bengaluru'
  | 'Kochi'
  | 'Bhubaneswar';

export type LeadDay = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ConfidenceClass = 'HIGH' | 'MODERATE' | 'LOW' | 'VERY_LOW';

export type AudienceType = 'General' | 'Farmer' | 'Disaster Management';

export interface RegionalMetric {
  region: RegionId;
  leadDay: LeadDay;
  ensembleSpread: number; // in mm or m/s spread
  steeringFlowStrength: 'Strong' | 'Moderate' | 'Weak' | 'Very Weak';
  monsoonPhase: 'Active' | 'Break' | 'Transition' | 'Normal' | 'Pre-Monsoon';
  climatologicalErrorRate: number; // percentage (0-100)
  runToRunConsistency: 'HIGH' | 'MODERATE' | 'LOW' | 'CRITICAL_SHIFT';
  bustProbability: number; // percentage (0-100)
  confidenceScore: number; // percentage (0-100)
  confidenceClass: ConfidenceClass;
  topReasons: { feature: string; impact: string; contribution: number }[];
  analogEvent: {
    name: string;
    date: string;
    historicalError: number;
    similarity: number;
    synopticDescription: string;
  };
}

export interface RunHistoryItem {
  runLabel: string;
  runOffsetHours: number;
  bustProbability: number;
  confidenceScore: number;
  varianceFlag: boolean;
}

export interface RollingAccuracyRecord {
  date: string;
  dayIndex: number;
  rollingAccuracy: number;
  climatologyBaseline: number;
  observedBusts: number;
  predictedBusts: number;
}

export interface SectorAdvisory {
  audience: AudienceType;
  region: RegionId;
  leadDay: LeadDay;
  advisoryText: string;
  actionGuidance: string;
  riskTier: 'Normal' | 'Advisory' | 'Watch' | 'Critical';
}

export interface QueryParseResult {
  identifiedRegion: RegionId | null;
  identifiedLeadDay: LeadDay | null;
  identifiedVariable: string;
  summaryAnswer: string;
  metric?: RegionalMetric;
}

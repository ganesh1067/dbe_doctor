// Core type definitions for DBE Doctor

export interface Attribute {
  name: string;
  dataType?: string;
  isPrimaryKey?: boolean;
}

export interface FunctionalDependency {
  id: string;
  determinant: string[]; // Left side (determinant)
  dependent: string[];   // Right side (dependent)
}

export interface Relation {
  name: string;
  attributes: Attribute[];
  functionalDependencies: FunctionalDependency[];
  sampleData?: Record<string, string | number>[];
}

export interface ClosureResult {
  attributeSet: string[];
  closure: string[];
}

export interface NormalFormCheck {
  satisfied: boolean;
  reason: string;
  violations?: string[];
  details?: string;
}

export interface NormalFormAnalysis {
  '1NF': NormalFormCheck;
  '2NF': NormalFormCheck;
  '3NF': NormalFormCheck;
  'BCNF': NormalFormCheck;
  '4NF': NormalFormCheck;
  '5NF': NormalFormCheck;
}

export interface AnomalyExample {
  type: 'update' | 'insertion' | 'deletion';
  title: string;
  description: string;
  example: string;
  impact: string;
}

export interface DecompositionResult {
  relations: Relation[];
  isLossless: boolean | null; // null = cannot determine
  losslessExplanation: string;
  preservesDependencies: boolean | null;
  dependencyExplanation: string;
  foreignKeys: { from: string; to: string; attributes: string[] }[];
}

export interface AnalysisResult {
  relation: Relation;
  candidateKeys: string[][];
  primeAttributes: string[];
  superkeys: string[][];
  closures: ClosureResult[];
  normalForms: NormalFormAnalysis;
  anomalies: AnomalyExample[];
  decomposition?: DecompositionResult;
  warnings: string[];
}

export interface SampleDatabase {
  id: string;
  name: string;
  description: string;
  relation: Relation;
  purpose: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export type PageId = 
  | 'dashboard'
  | 'relation-designer'
  | 'fd-analyzer'
  | 'anomaly-detection'
  | 'normalization'
  | 'decomposition'
  | 'sample-database'
  | 'learning-center'
  | 'analysis-report';

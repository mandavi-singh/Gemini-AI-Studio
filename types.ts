export enum RiskLevel {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High'
}

export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi'
}

export interface PatientProfile {
  name?: string;
  age?: string;
  gender?: string;
  contact?: string;
  location?: string;
  storeSession?: boolean;
}

export interface SymptomData {
  description: string;
  duration: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

export interface Condition {
  name: string;
  likelihood: string;
  relevance: string;
  matchingSymptoms: string[];
  nonMatchingSymptoms: string[];
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface ClarifyingQuestion {
  id: number;
  text: string;
  options: string[];
}

export interface HealthAnalysis {
  executiveSummary: string;
  extractedSymptoms: string[];
  conditions: Condition[];
  riskScore: RiskLevel;
  riskExplanation: string;
  selfCareSteps: string[];
  medicationCaution: string[];
  redFlags: string[];
  infographicData: {
    keyPoint: string;
    topCondition: string;
    immediateAction: string;
  };
  flashcards: Flashcard[];
  knowledgeQuiz: QuizQuestion[]; // Educational quiz
  
  // New fields for adaptive flow
  isFinalReport: boolean;
  clarifyingQuestions?: ClarifyingQuestion[]; // Questions to ask the patient
}

export interface QuestionAnswer {
  questionId: number;
  questionText: string;
  answer: string;
}

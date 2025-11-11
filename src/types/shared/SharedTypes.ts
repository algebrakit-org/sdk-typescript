// Shared types for the Algebrakit Webservice API

export type InteractionType =
  | 'MULTISTEP'
  | 'MATH_TABLE'
  | 'FILL_IN_THE_BLANKS'
  | 'GEOMETRY'
  | 'STATISTICS'
  | 'NUMBER_LINE'
  | 'ARITHMETIC'
  | 'CHOICE';

export type ExerciseStatus =
  | 'FINISHED'
  | 'CORRECT'
  | 'ERROR'
  | 'VIRGIN'
  | 'SUBMITTED'
  | 'GIVEUP'
  | 'UNKNOWN';

export interface InteractionScoring {
  finished: boolean;
  marksTotal: number;
  marksEarned: number;
  penalties?: {
    marksPenalty?: number;
    hintsRequested?: number;
    mathErrors?: number;
  };
}

export interface TagDescription {
  descr: Record<string, string>;
  stepType: 'STRATEGY' | 'ALGEBRA' | 'CALCULATE' | 'ROUND' | 'CONCEPT';
  errors?: Array<{
    id: string;
    type: Array<'misconception' | 'mistake'>;
    descr: Record<string, string>;
  }>;
}

export interface QuestionResult {
  id: string;
  scoring: InteractionScoring;
  interactions: Array<InteractionResult>;
}

export interface InteractionResult {
  id: string;
  type: InteractionType;
  status: ExerciseStatus;
  progress: number;
  scoring: InteractionScoring;
  tags: Array<FeedbackTag>;
  events: Array<InteractionEvent>;
}

export interface FeedbackTag {
  id: string;
  errors?: string[];
  weight: number;
  source: 'ERROR_FEEDBACK' | 'FINISHED_STEP' | 'HINT';
}

export interface InteractionEvent {
  timestamp: number;
  event: 'EVALUATE' | 'HINT' | 'GIVEUP' | 'SUBMIT';
  exerciseStatus?: ExerciseStatus;
  progress?: number;
  inputStatus?: ExerciseStatus;
  tags?: Array<FeedbackTag>;
  annotations?: Array<Annotation>;
}

// AnnotationType enum for better type safety
export type AnnotationType = 'HINT' | 'ERROR_FEEDBACK' | 'INPUT_EXPRESSION' | 'SELECTED_OPTIONS' | 'INPUT';

// Used for /session/score endpoint (maintains backward compatibility)
export interface Annotation {
  type: 'INPUT_EXPRESSION' | 'ERROR_FEEDBACK' | 'SELECTED_OPTIONS' | 'INPUT_CONTENT';
  expr?: Array<RichContent>;
  main?: Array<RichContent>;
  sub?: Array<RichContent>;
}

export interface RichContent {
  content: string;
  mimeType: string;
  akit?: string;
}

export interface ElementInfo {
  id: string;
  type: 'INSTRUCTION' | 'QUESTION';
  items: Array<ElementItemInfo>;
}

export interface ElementItemInfo {
  id?: string;
  itemType: 'TEXT' | 'INTERACTION';
  interactionType?: InteractionType;
  content?: string;
  solution?: string;
  derivation?: Array<DerivationPart>;
  result?: InteractionResultInfo;
}

export interface DerivationPart {
  hint?: string;
  expression?: string;
  result?: string;
  description?: string;
  skills?: Array<string>;
  derivation?: Array<DerivationPart>;
}

export interface InteractionResultInfo {
  status: ExerciseStatus;
  progress: number;
  scoring: InteractionScoring;
  tags: Array<FeedbackTag>;
  events: Array<EventResultInfo>;
}

export interface EventResultInfo {
  timestamp: number;
  event: 'EVALUATE' | 'HINT' | 'GIVEUP' | 'SUBMIT';
  exerciseStatus?: ExerciseStatus;
  progress?: number;
  inputStatus?: ExerciseStatus;
  tags?: Array<FeedbackTag>;
  annotations?: Array<InfoAnnotation>;
  skillsTodo?: Array<string>;
}

// Used for /session/info endpoint (AL-3197 changes)
export interface InfoAnnotation {
  type: AnnotationType;
  content?: string;    // HTML format - combines former main, sub, and text fields
  expression?: string; // LaTeX format - replaces former expr field
  // Additional fields for specific interaction types
  gapIndex?: number;   // For Fill in the Blanks questions (1-indexed)
  row?: number;        // For Math Table questions (1-indexed)
  col?: number;        // For Math Table questions (1-indexed)
}

export interface InteractionDescription {
  type: InteractionType;
  marks: number;
  scorable?: boolean;
}

export interface SessionData {
  success: boolean;
  msg?: string;
  sessionId: string;
  type: 'SINGLE' | 'COMPOUND';
  solution?: boolean;
  html: string;
  marksTotal: number;
  interactions: Record<string, InteractionDescription>;
}

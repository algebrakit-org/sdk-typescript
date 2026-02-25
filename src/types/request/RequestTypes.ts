// Request types for the Algebrakit Webservice API

export interface CreateSessionOptions {
  validate?: boolean;
  productionMode?: boolean;
  generateDebugInfo?: boolean;
}

export interface CreateSessionRequest {
  exercises: Array<{
    exerciseId?: string;
    version?: string;
    exerciseSpec?: Record<string, unknown>;
    sessionId?: string;
  }>;
  options?: CreateSessionOptions;
  scoringModel?: string;
  assessmentMode?: boolean;
  requireLockForSolution?: boolean;
  apiVersion: 2;
}

export interface SessionScoreRequest {
  sessionId: string;
  lockSession?: boolean;
}

export interface SessionLockRequest {
  action: 'LOCK' | 'UNLOCK' | 'FINALIZE';
  sessionIds: string[];
}

export interface SessionInfoRequest {
  sessionId: string;
}

export interface SessionRetrieveRequest {
  sessionIds: string[];
}

export interface ExerciseValidateRequest {
  exerciseId?: string;
  version?: string | number;
  exerciseSpec?: Record<string, unknown>;
}

export interface ExerciseInfoRequest {
  id: string;
}

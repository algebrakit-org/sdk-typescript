// Request types for the Algebrakit Webservice API

import { IAK_Exercise } from '../exercise/AK_ExerciseTypes';

export type AK_StudentFeedbackType = 'ALL' | 'ICONS_ONLY' | 'ERRORS_ONLY' | 'NONE';

export interface CreateSessionOptions {
  validate?: boolean;
  productionMode?: boolean;
  generateDebugInfo?: boolean;
}

export interface CreateSessionRequest {
  exercises: Array<{
    exerciseId?: string;
    version?: string;
    exerciseSpec?: IAK_Exercise | Record<string, unknown>;
    sessionId?: string;
    nr?: number;
  }>;
  options?: CreateSessionOptions;
  scoringModel?: string;
  assessmentMode?: boolean;
  requireLockForSolution?: boolean;
  studentFeedbackType?: AK_StudentFeedbackType;
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
  exerciseSpec?: IAK_Exercise | Record<string, unknown>;
}

export interface ExerciseInfoRequest {
  id: string;
}

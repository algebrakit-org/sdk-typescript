import { ApiClient } from '../src/ApiClient';
import { loadConfig } from './config';
import {
  CreateSessionRequest,
  SessionScoreRequest,
  SessionLockRequest,
  SessionInfoRequest,
  ExerciseValidateRequest,
  SessionScoreResponse
} from '../src/types/ApiTypes';

// Test exercise ID as specified in requirements
const TEST_EXERCISE_ID = 'fa42e943-8213-41a6-8a91-8c22a929ffe9';

/**
 * Displays penalties in a formatted way
 */
function displayPenalties(penalties: any, level: string): void {
  if (!penalties) {
    console.log(`   ${level} Penalties: None`);
    return;
  }
  
  console.log(`   ${level} Penalties:`);
  console.log(`     - Hints Requested: ${penalties.hintsRequested || 0}`);
  console.log(`     - Math Errors: ${penalties.mathErrors || 0}`);
  console.log(`     - Marks Penalty: ${penalties.marksPenalty || 0}`);
}

/**
 * Step 1: Validate exercise
 */
async function validateExercise(client: ApiClient): Promise<void> {
  console.log('\nStep 1: Validating Exercise');
  console.log(`   Exercise ID: ${TEST_EXERCISE_ID}`);
  
  try {
    const request: ExerciseValidateRequest = {
      exerciseId: TEST_EXERCISE_ID
    };
    
    const response = await client.validateExercise(request);
    
    console.log('Exercise validation successful');
    console.log(`   - Valid: ${response.valid}`);
    console.log(`   - Marks: ${response.marks || 'N/A'}`);
    console.log(`   - Random: ${response.random || false}`);
    
    if (response.interactions) {
      const interactionCount = Object.keys(response.interactions).length;
      console.log(`   - Interactions: ${interactionCount}`);
    }
  } catch (error: any) {
    console.error('   ❌ Exercise validation failed:', error.message);
    throw error;
  }
}

/**
 * Step 2: Create a new session
 */
async function createSession(client: ApiClient): Promise<string> {
  console.log('\nStep 2: Creating New Session');
  console.log(`   Exercise ID: ${TEST_EXERCISE_ID}`);
  
  try {
    const request: CreateSessionRequest = {
      exercises: [
        {
          exerciseId: TEST_EXERCISE_ID,
          version: 'latest'
        }
      ],
      apiVersion: 2
    };
    
    const response = await client.createSession(request);
    
    // Extract session ID from response
    if (response && response.length > 0 && response[0].sessions && response[0].sessions.length > 0) {
      const sessionId = response[0].sessions[0].sessionId;
      console.log('Session created successfully');
      console.log(`   - Session ID: ${sessionId}`);
      console.log(`   - Success: ${response[0].success}`);
      return sessionId;
    } else {
      throw new Error('No session ID returned in response');
    }
  } catch (error: any) {
    console.error('   ❌ Session creation failed:', error.message);
    throw error;
  }
}

/**
 * Step 3: Lock and unlock the session
 */
async function lockUnlockSession(client: ApiClient, sessionId: string): Promise<void> {
  console.log('\nStep 3: Testing Session Lock/Unlock');
  console.log(`   Session ID: ${sessionId}`);
  
  try {
    // Lock the session
    console.log('   Locking session...');
    const lockRequest: SessionLockRequest = {
      action: 'LOCK',
      sessionIds: [sessionId]
    };
    
    await client.lockSession(lockRequest);
    console.log('   Session locked successfully');
    
    // Unlock the session
    console.log('   Unlocking session...');
    const unlockRequest: SessionLockRequest = {
      action: 'UNLOCK',
      sessionIds: [sessionId]
    };
    
    await client.lockSession(unlockRequest);
    console.log('   Session unlocked successfully');
    
  } catch (error: any) {
    console.error('   ❌ Lock/Unlock operation failed:', error.message);
    throw error;
  }
}

/**
 * Step 4: Get session score with penalty information
 */
async function getSessionScore(client: ApiClient, sessionId: string): Promise<void> {
  console.log('\nStep 4: Getting Session Score with Penalties');
  console.log(`   Session ID: ${sessionId}`);
  
  try {
    const request: SessionScoreRequest = {
      sessionId: sessionId,
      lockSession: false
    };
    
    const response: SessionScoreResponse = await client.getSessionScore(request);
    
    console.log('   Session score retrieved successfully');
    
    // Display exercise-level scoring with penalties
    console.log('\n   Exercise Level Scoring:');
    console.log(`   - Finished: ${response.scoring.finished}`);
    console.log(`   - Marks Total: ${response.scoring.marksTotal}`);
    console.log(`   - Marks Earned: ${response.scoring.marksEarned}`);
    displayPenalties(response.scoring.penalties, 'Exercise');
    
    // Display question-level scoring with penalties
    if (response.questions && response.questions.length > 0) {
      console.log('\n   Question Level Scoring:');
      response.questions.forEach((question, qIndex) => {
        console.log(`\n   Question ${qIndex + 1} (ID: ${question.id}):`);
        console.log(`     - Finished: ${question.scoring.finished}`);
        console.log(`     - Marks Total: ${question.scoring.marksTotal}`);
        console.log(`     - Marks Earned: ${question.scoring.marksEarned}`);
        displayPenalties(question.scoring.penalties, 'Question');
        
        // Display interaction-level scoring with penalties
        if (question.interactions && question.interactions.length > 0) {
          console.log(`\n     💡 Interactions for Question ${qIndex + 1}:`);
          question.interactions.forEach((interaction, iIndex) => {
            console.log(`\n     Interaction ${iIndex + 1} (ID: ${interaction.id}):`);
            console.log(`       - Type: ${interaction.type}`);
            console.log(`       - Status: ${interaction.status}`);
            console.log(`       - Progress: ${interaction.progress}`);
            console.log(`       - Finished: ${interaction.scoring.finished}`);
            console.log(`       - Marks Total: ${interaction.scoring.marksTotal}`);
            console.log(`       - Marks Earned: ${interaction.scoring.marksEarned}`);
            displayPenalties(interaction.scoring.penalties, 'Interaction');
          });
        }
      });
    }
    
    // Verify penalty aggregation
    console.log('\n   Verifying Penalty Aggregation:');
    verifyPenaltyAggregation(response);
    
  } catch (error: any) {
    console.error('   ❌ Failed to get session score:', error.message);
    throw error;
  }
}

/**
 * Verify that penalties are correctly aggregated across levels
 */
function verifyPenaltyAggregation(response: SessionScoreResponse): void {
  let totalHintsFromQuestions = 0;
  let totalErrorsFromQuestions = 0;
  let totalPenaltyFromQuestions = 0;
  
  // Sum up penalties from all questions
  response.questions?.forEach(question => {
    if (question.scoring.penalties) {
      totalHintsFromQuestions += question.scoring.penalties.hintsRequested || 0;
      totalErrorsFromQuestions += question.scoring.penalties.mathErrors || 0;
      totalPenaltyFromQuestions += question.scoring.penalties.marksPenalty || 0;
    }
    
    // Also verify question level aggregation from interactions
    let questionHints = 0;
    let questionErrors = 0;
    let questionPenalty = 0;
    
    question.interactions?.forEach(interaction => {
      if (interaction.scoring.penalties) {
        questionHints += interaction.scoring.penalties.hintsRequested || 0;
        questionErrors += interaction.scoring.penalties.mathErrors || 0;
        questionPenalty += interaction.scoring.penalties.marksPenalty || 0;
      }
    });
    
    // Verify question-level aggregation
    const qPenalties = question.scoring.penalties;
    if (qPenalties) {
      const hintsMatch = (qPenalties.hintsRequested || 0) === questionHints;
      const errorsMatch = (qPenalties.mathErrors || 0) === questionErrors;
      const penaltyMatch = (qPenalties.marksPenalty || 0) === questionPenalty;
      
      console.log(`   Question ${question.id} aggregation: ${hintsMatch && errorsMatch && penaltyMatch ? '✅' : '❌'}`);
      if (!hintsMatch) console.log(`     ⚠️  Hints mismatch: ${qPenalties.hintsRequested} vs ${questionHints}`);
      if (!errorsMatch) console.log(`     ⚠️  Errors mismatch: ${qPenalties.mathErrors} vs ${questionErrors}`);
      if (!penaltyMatch) console.log(`     ⚠️  Penalty mismatch: ${qPenalties.marksPenalty} vs ${questionPenalty}`);
    }
  });
  
  // Verify exercise-level aggregation
  const exercisePenalties = response.scoring.penalties;
  if (exercisePenalties) {
    const hintsMatch = (exercisePenalties.hintsRequested || 0) === totalHintsFromQuestions;
    const errorsMatch = (exercisePenalties.mathErrors || 0) === totalErrorsFromQuestions;
    const penaltyMatch = (exercisePenalties.marksPenalty || 0) === totalPenaltyFromQuestions;
    
    console.log(`   Exercise level aggregation: ${hintsMatch && errorsMatch && penaltyMatch ? '✅' : '❌'}`);
    if (!hintsMatch) console.log(`     ⚠️  Hints mismatch: ${exercisePenalties.hintsRequested} vs ${totalHintsFromQuestions}`);
    if (!errorsMatch) console.log(`     ⚠️  Errors mismatch: ${exercisePenalties.mathErrors} vs ${totalErrorsFromQuestions}`);
    if (!penaltyMatch) console.log(`     ⚠️  Penalty mismatch: ${exercisePenalties.marksPenalty} vs ${totalPenaltyFromQuestions}`);
  } else {
    console.log('   ℹNo penalties at exercise level (might be a new session)');
  }
}

/**
 * Step 5: Get detailed session information
 */
async function getSessionInfo(client: ApiClient, sessionId: string): Promise<void> {
  console.log('\n📄 Step 5: Getting Detailed Session Information');
  console.log(`   Session ID: ${sessionId}`);
  
  try {
    const request: SessionInfoRequest = {
      sessionId: sessionId
    };
    
    const response = await client.getSessionInfo(request);
    
    console.log('   Session info retrieved successfully!');
    
    if (response.elements && response.elements.length > 0) {
      console.log(`   - Elements: ${response.elements.length}`);
      response.elements.forEach((element, index) => {
        console.log(`\n   Element ${index + 1}:`);
        console.log(`     - Type: ${element.type}`);
        if (element.items) {
          console.log(`     - Items: ${element.items.length}`);
        }
      });
    }
    
    if (response.tagDescriptions) {
      const tagCount = Object.keys(response.tagDescriptions).length;
      console.log(`\n   - Tag Descriptions: ${tagCount} tags`);
    }
    
  } catch (error: any) {
    console.error('   ❌ Failed to get session info:', error.message);
    throw error;
  }
}

/**
 * Main demo function
 */
async function runDemo(): Promise<void> {
  console.log('\nAlgebrakit TypeScript SDK Demo');
  console.log('=' .repeat(50));
  
  // Load configuration
  const config = loadConfig();
  
  // Initialize API client
  const client = new ApiClient(config.apiUrl, config.apiKey);
  
  try {
    // Run test scenario
    await validateExercise(client);
    
    const sessionId = await createSession(client);
    await lockUnlockSession(client, sessionId);
    
    await getSessionScore(client, sessionId);
    
    await getSessionInfo(client, sessionId);
    
  } catch (error: any) {
    console.error('\n❌ Demo failed with error:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (error: any) => {
  console.error('\n❌ Unhandled error:', error.message);
  process.exit(1);
});

// Run the demo
runDemo();
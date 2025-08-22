# Algebrakit SDK Demo

This demo application showcases the Algebrakit TypeScript SDK functionality, with special emphasis on the penalty aggregation feature at all scoring levels (interaction, question, and exercise).

## Quick Start

### 1. Install Dependencies

First, install the required dependencies from the SDK root directory:

```bash
cd /path/to/sdk-typescript
npm install
npm install --save-dev dotenv
```

### 2. Configure API Key

Copy the example environment file and add your API key:

```bash
cd demo
cp .env.example .env
```

Edit `.env` and replace `your_api_key_here` with your actual Algebrakit API key:

```
ALGEBRAKIT_API_KEY=your_actual_api_key
```

### 3. Run the Demo

From the SDK root directory, run:

```bash
npm run demo
```

Or compile and run directly:

```bash
npx ts-node demo/demo.ts
```

## What the Demo Does

The demo performs the following test scenario:

1. **Validates an exercise** (ID: fa42e943-8213-41a6-8a91-8c22a929ffe9)
   - Confirms the exercise exists and is valid
   - Shows exercise metadata (marks, interactions)

2. **Creates a new session** with the validated exercise
   - Returns a unique session ID
   - Initializes the exercise for interaction

3. **Tests session locking/unlocking**
   - Locks the session to prevent modifications
   - Unlocks the session to allow further interaction

4. **Retrieves session scores with penalty information**
   - Shows scoring at exercise level with aggregated penalties
   - Shows scoring at question level with aggregated penalties
   - Shows scoring at interaction level with individual penalties
   - **Verifies penalty aggregation** is working correctly

5. **Gets detailed session information**
   - Displays session structure and elements
   - Shows available tag descriptions

## Key Feature: Penalty Aggregation

The demo specifically highlights the AL-3252 feature implementation:

- **Interaction Level**: Shows individual penalties (hints requested, math errors, marks penalty)
- **Question Level**: Shows aggregated penalties from all interactions in the question
- **Exercise Level**: Shows aggregated penalties from all questions in the exercise

The demo includes automatic verification to ensure penalties are correctly summed at each level.

## Output Example

```
🚀 Algebrakit TypeScript SDK Demo
==================================================

📋 Configuration:
   API URL: https://api.algebrakit.com
   API Key: sk_test_...1234

📝 Step 1: Validating Exercise
   Exercise ID: fa42e943-8213-41a6-8a91-8c22a929ffe9
   ✅ Exercise validation successful!
   - Valid: true
   - Marks: 10
   - Interactions: 3

🎯 Step 2: Creating New Session
   ✅ Session created successfully!
   - Session ID: 0a405901-8b89-4665-9ea0-6dbdff3602fc

🔒 Step 3: Testing Session Lock/Unlock
   ✅ Session locked successfully
   ✅ Session unlocked successfully

📊 Step 4: Getting Session Score with Penalties
   📈 Exercise Level Scoring:
   - Finished: false
   - Marks Total: 10
   - Marks Earned: 0
   Exercise Penalties:
     - Hints Requested: 5
     - Math Errors: 3
     - Marks Penalty: 8

   📋 Question Level Scoring:
   Question 1:
     - Marks Total: 5
     - Marks Earned: 0
   Question Penalties:
     - Hints Requested: 3
     - Math Errors: 2
     - Marks Penalty: 5

   🔍 Verifying Penalty Aggregation:
   Question Q1 aggregation: ✅
   Exercise level aggregation: ✅

📄 Step 5: Getting Detailed Session Information
   ✅ Session info retrieved successfully!
   - Elements: 2
   - Tag Descriptions: 15 tags

✨ Demo completed successfully!
```

## Troubleshooting

### API Key Issues
- Ensure your API key is valid and has the necessary permissions
- Check that the `.env` file is in the `demo` directory
- Verify the API key doesn't contain any extra spaces or quotes

### Network Issues
- Ensure you have internet connectivity
- Check if the API endpoint (https://api.algebrakit.com) is accessible
- Verify any firewall or proxy settings

### TypeScript Issues
- Make sure TypeScript is installed: `npm install -g typescript`
- Ensure all dependencies are installed: `npm install`
- Try clearing the TypeScript cache: `rm -rf node_modules/.cache`

## Files

- `demo.ts` - Main demo application with all test scenarios
- `config.ts` - Configuration management and validation
- `.env.example` - Example environment configuration
- `.env` - Your actual configuration (not tracked in git)

## Next Steps

After running the demo successfully, you can:

1. Modify the demo to test different exercises
2. Add more detailed penalty testing scenarios
3. Integrate the SDK into your own application
4. Explore the SDK documentation for advanced features
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

export interface Config {
  apiKey: string;
  apiUrl: string;
}

/**
 * Loads and validates configuration from environment variables
 */
export function loadConfig(): Config {
  const apiKey = process.env.ALGEBRAKIT_API_KEY;
  const apiUrl = process.env.ALGEBRAKIT_API_URL || 'https://api.algebrakit.com';

  // Validate configuration
  if (!apiKey) {
    console.error('\n❌ Error: ALGEBRAKIT_API_KEY is not set');
    console.error('Please create a .env file in the demo directory with your API key.');
    console.error('You can copy .env.example to .env and add your key.\n');
    process.exit(1);
  }

  if (apiKey === 'your_api_key_here') {
    console.error('\n❌ Error: Please replace the placeholder API key with your actual key');
    console.error('Edit the .env file and add your real Algebrakit API key.\n');
    process.exit(1);
  }

  return {
    apiKey,
    apiUrl
  };
}

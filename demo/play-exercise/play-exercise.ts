/**
 * AlgebraKit TypeScript SDK - Web Demo
 * =====================================
 * This demo creates an AlgebraKit exercise session using the SDK
 * and serves it as an interactive web page with learning event logging.
 *
 * The server handles two kinds of requests:
 * - /proxy/algebrakit/* — forwards widget API calls to AlgebraKit with the API key attached
 * - everything else    — serves the exercise page (index.html)
 *
 * Prerequisites:
 * - Node.js installed
 * - npm install completed
 * - A valid API key in demo/play-exercise/.env (see .env.example)
 *
 * To run:
 *   npm run play-exercise
 *
 * Then open http://localhost:3000 in your browser.
 */

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import httpProxy from 'http-proxy';
import { ApiClient } from '../../src/ApiClient';
import { CreateSessionRequest } from '../../src/types/ApiTypes';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Configuration
const API_KEY = process.env.ALGEBRAKIT_API_KEY;
const API_URL = process.env.ALGEBRAKIT_API_URL || 'https://api.algebrakit.com';
const WIDGET_URL = process.env.ALGEBRAKIT_WIDGET_URL || 'https://widgets.algebrakit.com';
const EXERCISE_ID = 'fa42e943-8213-41a6-8a91-8c22a929ffe9';
const PORT = parseInt(process.env.PORT || '3000', 10);
const PROXY_PREFIX = '/proxy/algebrakit';

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.error('\nError: ALGEBRAKIT_API_KEY is not set or is still the placeholder.');
  console.error('Please create a .env file in this directory with your API key.');
  console.error('You can copy .env.example to .env and add your key.\n');
  process.exit(1);
}

async function createExerciseSession(): Promise<{ html: string | null; error: string | null }> {
  try {
    const client = new ApiClient(API_URL, API_KEY!);

    const request: CreateSessionRequest = {
      exercises: [{ exerciseId: EXERCISE_ID, version: 'latest' }],
      apiVersion: 2,
    };

    const response = await client.createSession(request);

    if (response && response.length > 0 && response[0].success && response[0].sessions?.length > 0) {
      return { html: response[0].sessions[0].html, error: null };
    } else {
      return { html: null, error: response?.[0]?.msg || 'Unknown error creating session' };
    }
  } catch (e: any) {
    return { html: null, error: e.message };
  }
}

// Proxy: forwards widget requests to the AlgebraKit API with the API key attached.
const proxy = httpProxy.createProxyServer({ target: API_URL, changeOrigin: true });

proxy.on('proxyReq', (proxyReq) => {
  proxyReq.setHeader('x-api-key', API_KEY!);
});

proxy.on('error', (err, _req, res) => {
  console.error('Proxy error:', err.message);
  (res as http.ServerResponse).writeHead(502, { 'Content-Type': 'application/json' });
  (res as http.ServerResponse).end(JSON.stringify({ error: 'Proxy error', message: err.message }));
});

async function main() {
  console.log('Creating exercise session...');
  const { html, error } = await createExerciseSession();

  if (error) {
    console.log(`Session creation failed: ${error}`);
    console.log('The error will be displayed on the page.');
  } else {
    console.log('Session created successfully.');
  }

  // Build the page by reading the HTML template and replacing placeholders
  const template = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  const exerciseContent = error
    ? `<div class="error">${error}</div>`
    : `<div class="exercise-container">${html}</div>`;

  const page = template
    .replace('{{PROXY_URL}}', PROXY_PREFIX)
    .replace('{{WIDGET_URL}}', WIDGET_URL)
    .replace('{{EXERCISE_CONTENT}}', exerciseContent);

  const server = http.createServer((req, res) => {
    if (req.url && req.url.startsWith(PROXY_PREFIX)) {
      req.url = req.url.substring(PROXY_PREFIX.length); // strip prefix
      proxy.web(req, res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(page);
    }
  });

  server.listen(PORT, () => {
    console.log(`\nOpen http://localhost:${PORT} in your browser.`);
  });
}

main();

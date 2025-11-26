# Algebrakit Webservice API SDK

This is a Node.js/TypeScript SDK for interacting with the Algebrakit Webservice API. It provides methods for creating sessions, retrieving scores, locking/unlocking sessions, and fetching session information.

## Usage

### Initialize the API Client

```typescript
import { ApiClient } from './src/ApiClient';

const apiClient = new ApiClient('https://api.algebrakit.com', 'your-api-key');
```

### Create a Session

```typescript
import { CreateSessionRequest } from './src/types/ApiTypes';

const request: CreateSessionRequest = {
  exercises: [
    { exerciseId: 'fa42e943-8213-41a6-8a91-8c22a929ffe9', version: 'latest' },
  ],
  apiVersion: 2,
};

apiClient.createSession(request).then(response => {
  console.log('Session created:', response);
}).catch(error => {
  console.error('Error creating session:', error);
});
```

### Retrieve Session Scores

```typescript
import { SessionScoreRequest } from './src/types/ApiTypes';

const request: SessionScoreRequest = {
  sessionId: '0a405901-8b89-4665-9ea0-6dbdff3602fc',
  lockSession: true,
};

apiClient.getSessionScore(request).then(response => {
  console.log('Session scores:', response);
}).catch(error => {
  console.error('Error retrieving scores:', error);
});
```

### Lock or Unlock Sessions

```typescript
import { SessionLockRequest } from './src/types/ApiTypes';

const request: SessionLockRequest = {
  action: 'LOCK',
  sessionIds: ['f2f62104-3b5a-4156-aeaf-291167e5f9e3'],
};

apiClient.lockSession(request).then(response => {
  console.log('Session locked:', response);
}).catch(error => {
  console.error('Error locking session:', error);
});
```

### Retrieve Session Information

```typescript
import { SessionInfoRequest } from './src/types/ApiTypes';

const request: SessionInfoRequest = {
  sessionId: '0a405901-8b89-4665-9ea0-6dbdff3602fc',
};

apiClient.getSessionInfo(request).then(response => {
  console.log('Session info:', response);
}).catch(error => {
  console.error('Error retrieving session info:', error);
});
```

## Error Handling

Use the `handleApiError` utility to standardize error messages:

```typescript
import { handleApiError } from './src/utils/errorHandler';

apiClient.createSession(request).catch(error => {
  console.error(handleApiError(error));
});
```

## License

This SDK is licensed under the MIT License.
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleApiError = handleApiError;
/**
 * Handles errors from Axios requests and provides a standardized error message.
 * @param error The Axios error object.
 * @returns A standardized error message.
 */
function handleApiError(error) {
    if (error.response) {
        // Server responded with a status code outside the 2xx range
        return `API Error: ${error.response.status} - ${error.response.data}`;
    }
    else if (error.request) {
        // Request was made but no response was received
        return 'API Error: No response received from the server.';
    }
    else {
        // Something happened in setting up the request
        return `API Error: ${error.message}`;
    }
}

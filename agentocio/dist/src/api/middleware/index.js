/**
 * Middleware Index
 *
 * This file exports all middleware components and provides a setup function
 * to configure them on an Express application instance.
 */
import { config } from '../config.js';
import auth from './auth.js';
import validation from './validation.js';
import logging from './logging.js';
// Import directly from safe-rate-limiter to avoid TypeScript issues with rate-limiter.ts
import { rateLimiter } from '../utils/safe-rate-limiter.js';
// Export all middleware modules
export { auth, validation, logging };
/**
 * Configure middleware for the Express application
 */
export function setupMiddleware(app, options) {
    const { storage } = options;
    // Setup HTTP request logging
    app.use(logging.requestLogger);
    // Enable detailed request/response logging in debug mode
    if (config.logging.level === 'debug') {
        app.use(logging.detailedLogger);
    }
    // Apply our custom rate limiting to all routes
    app.use(rateLimiter({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max
    }));
    // Log all tool calls
    app.use(logging.toolCallLogger);
    // Set up error logging as the last middleware
    app.use(logging.errorLogger);
}
// Export default for ESM compatibility
export default {
    setupMiddleware,
    auth,
    validation,
    logging
};
//# sourceMappingURL=index.js.map
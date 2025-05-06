/**
 * Rate Limiter Utility
 *
 * This file provides rate limiting functionality for the API.
 */
import { config } from '../config.js';
import { ApiErrors } from './api-error.js';
class MemoryStore {
    store = new Map();
    /**
     * Get rate limit record for a key
     */
    get(key) {
        return this.store.get(key);
    }
    /**
     * Set rate limit record for a key
     */
    set(key, record) {
        this.store.set(key, record);
    }
    /**
     * Reset all records (for testing)
     */
    reset() {
        this.store.clear();
    }
    /**
     * Clean up expired records
     */
    cleanup() {
        const now = Date.now();
        for (const [key, record] of this.store.entries()) {
            if (record.resetAt <= now) {
                this.store.delete(key);
            }
        }
    }
}
// Create memory store
const memoryStore = new MemoryStore();
// Start cleanup interval
setInterval(() => {
    memoryStore.cleanup();
}, 60000); // Cleanup every minute
/**
 * Get rate limit key from request
 * Uses API key, IP address, or a combination
 */
const getRateLimitKey = (req) => {
    // If the user is authenticated with an API key, use that
    if (req.apiKey) {
        return `apikey:${req.apiKey}`;
    }
    // If the user is authenticated with a JWT, use their ID
    if (req.user?.id) {
        return `user:${req.user.id}`;
    }
    // Otherwise, use IP address
    const ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        'unknown';
    return `ip:${ip}`;
};
/**
 * Rate limiter middleware
 */
export const rateLimiter = (
// Custom options to override config
options) => {
    const windowMs = options?.windowMs || config.rateLimit.windowMs;
    const max = options?.max || config.rateLimit.max;
    const message = options?.message || 'Too many requests, please try again later';
    return (req, res, next) => {
        // Get rate limit key
        const key = getRateLimitKey(req);
        const now = Date.now();
        // Get current record
        const record = memoryStore.get(key);
        if (!record) {
            // First request, create new record
            memoryStore.set(key, {
                count: 1,
                resetAt: now + windowMs
            });
            // Set rate limit headers
            res.setHeader('X-RateLimit-Limit', max.toString());
            res.setHeader('X-RateLimit-Remaining', (max - 1).toString());
            res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000).toString());
            return next();
        }
        // Check if window has expired
        if (record.resetAt <= now) {
            // Reset the counter
            memoryStore.set(key, {
                count: 1,
                resetAt: now + windowMs
            });
            // Set rate limit headers
            res.setHeader('X-RateLimit-Limit', max.toString());
            res.setHeader('X-RateLimit-Remaining', (max - 1).toString());
            res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000).toString());
            return next();
        }
        // Check if over limit
        if (record.count >= max) {
            // Set rate limit headers
            res.setHeader('X-RateLimit-Limit', max.toString());
            res.setHeader('X-RateLimit-Remaining', '0');
            res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000).toString());
            res.setHeader('Retry-After', Math.ceil((record.resetAt - now) / 1000).toString());
            // Return rate limit error
            const error = ApiErrors.rateLimitExceeded(message);
            return res.status(error.status).json(error.toJSON());
        }
        // Increment counter
        record.count += 1;
        memoryStore.set(key, record);
        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', max.toString());
        res.setHeader('X-RateLimit-Remaining', (max - record.count).toString());
        res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000).toString());
        next();
    };
};
export default {
    rateLimiter
};
//# sourceMappingURL=rate-limiter.js.map
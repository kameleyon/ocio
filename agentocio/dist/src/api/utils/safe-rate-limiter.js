/**
 * Safe Rate Limiter Utility
 *
 * An alternative implementation of rate limiting that avoids using Map iterators.
 */
import { config } from '../config.js';
import { ApiErrors } from './api-error.js';
/**
 * Simple memory store that avoids using Map iterators
 */
class SafeMemoryStore {
    // Use an object instead of Map to avoid iterator issues
    records = {};
    lastCleanup = Date.now();
    /**
     * Get a record by key
     */
    get(key) {
        return this.records[key];
    }
    /**
     * Set a record for a key
     */
    set(key, record) {
        this.records[key] = record;
        // Periodically clean up expired records
        // Only do this occasionally to avoid performance issues
        const now = Date.now();
        if (now - this.lastCleanup > 60000) { // Once per minute at most
            this.cleanup();
            this.lastCleanup = now;
        }
    }
    /**
     * Delete a record
     */
    delete(key) {
        delete this.records[key];
    }
    /**
     * Reset all records
     */
    reset() {
        this.records = {};
    }
    /**
     * Clean up expired records
     */
    cleanup() {
        const now = Date.now();
        // Use Object.keys instead of Map iteration
        Object.keys(this.records).forEach(key => {
            const record = this.records[key];
            if (record && record.resetAt <= now) {
                delete this.records[key];
            }
        });
    }
}
// Create memory store
const memoryStore = new SafeMemoryStore();
/**
 * Get rate limit key from request
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
 * Safe rate limiter middleware
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
//# sourceMappingURL=safe-rate-limiter.js.map
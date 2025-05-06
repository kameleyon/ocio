/**
 * Logging Middleware
 *
 * This middleware handles request/response logging for the API wrapper.
 */
import morgan from 'morgan';
import { config } from '../config.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    console.log(`Created logs directory: ${logsDir}`);
}
// Create a write stream for access logging
const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
// Custom tokens for morgan
// NOTE: We remove explicit Express types from parameters here to match morgan's expected signature,
// and cast internally where Express-specific properties are needed.
morgan.token('id', (req) => {
    const expressReq = req; // Cast via unknown
    // Assign a request ID if not already present
    const id = expressReq.get('X-Request-Id') || uuidv4();
    // Ensure headers object exists before assigning to it
    if (expressReq.headers) {
        expressReq.headers['x-request-id'] = id;
    }
    return id;
});
morgan.token('user', (req) => {
    const expressReq = req; // Cast via unknown
    // Safely access potentially undefined properties
    const userId = expressReq.user ? expressReq.user.id : undefined;
    const apiKey = expressReq.apiKey;
    return userId || apiKey || 'anonymous';
});
morgan.token('error', (req, res) => {
    const expressRes = res; // Cast via unknown
    if (expressRes.statusCode >= 400) {
        // Safely access potentially undefined properties
        return expressRes.locals ? expressRes.locals.error : 'Unknown error';
    }
    return '';
});
// Create custom morgan format
const morganFormat = ':id :remote-addr :user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :error';
/**
 * Standard HTTP request logger middleware using Morgan
 */
export const requestLogger = morgan(config.logging.format || 'dev', {
    stream: config.env === 'production' ? accessLogStream : process.stdout
});
/**
 * Detailed request/response logger for debugging
 */
export const detailedLogger = (req, res, next) => {
    // Only log in debug mode to avoid performance impact
    if (config.logging.level !== 'debug') {
        return next();
    }
    // Generate a unique request ID
    const requestId = req.get('X-Request-Id') || uuidv4();
    req.headers['x-request-id'] = requestId;
    // Log the request details
    console.log(`[DEBUG] [${requestId}] Request:`, {
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query,
        body: req.body,
        headers: {
            'user-agent': req.get('user-agent'),
            'content-type': req.get('content-type'),
            'authorization': req.get('authorization') ? '**present**' : '**not-present**',
            'x-api-key': req.get('x-api-key') ? '**present**' : '**not-present**'
        }
    });
    // Capture the original response methods
    const originalSend = res.send;
    const originalJson = res.json;
    // Override res.send
    res.send = function (body) {
        // Log the response body
        console.log(`[DEBUG] [${requestId}] Response:`, {
            statusCode: res.statusCode,
            body: typeof body === 'string' ? body.substring(0, 200) + (body.length > 200 ? '...' : '') : body
        });
        // Call the original method
        return originalSend.apply(res, [body]);
    };
    // Override res.json
    res.json = function (body) {
        // Log the response body
        console.log(`[DEBUG] [${requestId}] Response:`, {
            statusCode: res.statusCode,
            body: body
        });
        // Call the original method
        return originalJson.apply(res, [body]);
    };
    next();
};
/**
 * Error logging middleware
 */
export const errorLogger = (err, req, res, next) => {
    // Store error for morgan
    res.locals.error = err.message || 'Unknown error';
    // Log the error
    console.error('[ERROR]', {
        requestId: req.get('X-Request-Id'),
        url: req.originalUrl,
        method: req.method,
        error: {
            message: err.message,
            stack: err.stack,
            ...err
        }
    });
    next(err);
};
/**
 * Tool call logging - records all tool executions to the database/filesystem
 */
export const toolCallLogger = (req, res, next) => {
    // Only for tool execution routes
    if (!req.path.includes('/execute-tool') && !req.path.includes('/tools/')) {
        return next();
    }
    // Create a log record of the tool call
    const logRecord = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        toolName: req.params.name || req.body.name,
        args: req.body.args,
        user: req.user?.id || 'api-key',
        apiKey: req.apiKey,
        requestId: req.get('X-Request-Id'),
        ip: req.ip
    };
    // In a real implementation, this would be stored in a database
    // For now, just log it to console
    console.log('[TOOL-CALL]', logRecord);
    next();
};
export default {
    requestLogger,
    detailedLogger,
    errorLogger,
    toolCallLogger
};
//# sourceMappingURL=logging.js.map
// Auto-generated safe fallback for custom-stdio
export function activate() {
    console.log("[TOOL] custom-stdio activated (passive mode)");
}
export function onFileWrite() { }
export function onSessionStart() { }
export function onCommand() { }
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import process from "node:process";
/**
 * Extended StdioServerTransport that filters out non-JSON messages.
 * This prevents potential errors from crashing the server.
 */
export class FilteredStdioServerTransport extends StdioServerTransport {
    constructor() {
        // Create a proxy for stdout that only allows valid JSON to pass through
        const originalStdoutWrite = process.stdout.write;
        process.stdout.write = function (buffer) {
            // Only intercept string output that doesn't look like JSON
            if (typeof buffer === 'string' && !buffer.trim().startsWith('{')) {
                return true; // Silently discard non-JSON output
            }
            // @ts-ignore - Ignore TypeScript errors for this line
            return originalStdoutWrite.apply(process.stdout, arguments);
        };
        super();
        // Log initialization to stderr to avoid polluting the JSON stream
        process.stderr.write(`[optimuscode] Initialized FilteredStdioServerTransport\n`);
    }
}
//# sourceMappingURL=custom-stdio.js.map
export declare function activate(): void;
export declare function onFileWrite(): void;
export declare function onSessionStart(): void;
export declare function onCommand(): void;
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
/**
 * Extended StdioServerTransport that filters out non-JSON messages.
 * This prevents potential errors from crashing the server.
 */
export declare class FilteredStdioServerTransport extends StdioServerTransport {
    constructor();
}

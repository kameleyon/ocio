/**
 * Centralized Tool Registration System
 *
 * This file imports all tools from the code-tools directory and provides a unified
 * registration mechanism for MCP tools. This eliminates scattered registration logic
 * and ensures all tools are discoverable by MCP and LLMs via ListToolsRequestSchema.
 */
import { z } from 'zod';
/**
 * Tool definition with metadata
 */
interface Tool {
    name: string;
    description: string;
    module: any;
    inputSchema?: z.ZodType<any>;
}
/**
 * Register all tools with the MCP server
 * This function integrates tools with the MCP server through the plugin manager
 *
 * @param server The MCP server instance
 */
export declare function registerAllTools(server: any): Tool[];
export default registerAllTools;

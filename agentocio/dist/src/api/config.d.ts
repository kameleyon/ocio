/**
 * API Configuration Settings
 *
 * This file contains all configuration options for the OptimusCode API wrapper.
 */
export declare const config: {
    port: number;
    host: string;
    env: string;
    cors: {
        origin: string;
        methods: string[];
        allowedHeaders: string[];
    };
    auth: {
        jwtSecret: string;
        jwtExpiresIn: string;
        apiKeys: string[];
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
    storage: {
        type: string;
        filePath: string;
        mongoUri: string;
    };
    jobQueue: {
        concurrency: number;
        timeout: number;
        retries: number;
        autostart: boolean;
    };
    logging: {
        level: string;
        format: string;
    };
    tools: {
        defaultVisibility: string;
        internalTools: string[];
    };
};
export type Config = typeof config;
export default config;

import { z } from 'zod';
export declare function activate(): void;
/**
 * Handles file write events
 */
export declare function onFileWrite(event: {
    path: string;
    content: string;
}): void;
/**
 * Handles session start logic
 */
export declare function onSessionStart(session: {
    id: string;
    startTime: number;
}): void;
/**
 * Handles chat-logger commands
 */
export declare function onCommand(command: {
    name: string;
    args: any[];
}): Promise<{
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: string;
        text: string;
    }[];
    isError?: undefined;
} | {
    error: string;
}>;
export declare const LogMessageSchema: z.ZodObject<{
    conversationId: z.ZodString;
    role: z.ZodEnum<["user", "assistant", "system", "function", "tool", "data"]>;
    content: z.ZodString;
    metadata: z.ZodOptional<z.ZodObject<{
        userId: z.ZodOptional<z.ZodString>;
        userName: z.ZodOptional<z.ZodString>;
        modelId: z.ZodOptional<z.ZodString>;
        tokens: z.ZodOptional<z.ZodNumber>;
        promptTokens: z.ZodOptional<z.ZodNumber>;
        completionTokens: z.ZodOptional<z.ZodNumber>;
        tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        duration: z.ZodOptional<z.ZodNumber>;
        sessionId: z.ZodOptional<z.ZodString>;
        ip: z.ZodOptional<z.ZodString>;
        userAgent: z.ZodOptional<z.ZodString>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        tools?: string[] | undefined;
        custom?: Record<string, any> | undefined;
        sessionId?: string | undefined;
        ip?: string | undefined;
        duration?: number | undefined;
        userId?: string | undefined;
        userName?: string | undefined;
        userAgent?: string | undefined;
        modelId?: string | undefined;
        tokens?: number | undefined;
        promptTokens?: number | undefined;
        completionTokens?: number | undefined;
    }, {
        tools?: string[] | undefined;
        custom?: Record<string, any> | undefined;
        sessionId?: string | undefined;
        ip?: string | undefined;
        duration?: number | undefined;
        userId?: string | undefined;
        userName?: string | undefined;
        userAgent?: string | undefined;
        modelId?: string | undefined;
        tokens?: number | undefined;
        promptTokens?: number | undefined;
        completionTokens?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    conversationId: string;
    role: "function" | "tool" | "data" | "user" | "system" | "assistant";
    metadata?: {
        tools?: string[] | undefined;
        custom?: Record<string, any> | undefined;
        sessionId?: string | undefined;
        ip?: string | undefined;
        duration?: number | undefined;
        userId?: string | undefined;
        userName?: string | undefined;
        userAgent?: string | undefined;
        modelId?: string | undefined;
        tokens?: number | undefined;
        promptTokens?: number | undefined;
        completionTokens?: number | undefined;
    } | undefined;
}, {
    content: string;
    conversationId: string;
    role: "function" | "tool" | "data" | "user" | "system" | "assistant";
    metadata?: {
        tools?: string[] | undefined;
        custom?: Record<string, any> | undefined;
        sessionId?: string | undefined;
        ip?: string | undefined;
        duration?: number | undefined;
        userId?: string | undefined;
        userName?: string | undefined;
        userAgent?: string | undefined;
        modelId?: string | undefined;
        tokens?: number | undefined;
        promptTokens?: number | undefined;
        completionTokens?: number | undefined;
    } | undefined;
}>;
export declare const CreateConversationSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        userId: z.ZodOptional<z.ZodString>;
        userName: z.ZodOptional<z.ZodString>;
        modelId: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        category: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        custom?: Record<string, any> | undefined;
        summary?: string | undefined;
        tags?: string[] | undefined;
        userId?: string | undefined;
        category?: string | undefined;
        userName?: string | undefined;
        modelId?: string | undefined;
    }, {
        custom?: Record<string, any> | undefined;
        summary?: string | undefined;
        tags?: string[] | undefined;
        userId?: string | undefined;
        category?: string | undefined;
        userName?: string | undefined;
        modelId?: string | undefined;
    }>>;
    initialMessages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant", "system", "function", "tool", "data"]>;
        content: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        content: string;
        role: "function" | "tool" | "data" | "user" | "system" | "assistant";
        metadata?: Record<string, any> | undefined;
    }, {
        content: string;
        role: "function" | "tool" | "data" | "user" | "system" | "assistant";
        metadata?: Record<string, any> | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    metadata?: {
        custom?: Record<string, any> | undefined;
        summary?: string | undefined;
        tags?: string[] | undefined;
        userId?: string | undefined;
        category?: string | undefined;
        userName?: string | undefined;
        modelId?: string | undefined;
    } | undefined;
    initialMessages?: {
        content: string;
        role: "function" | "tool" | "data" | "user" | "system" | "assistant";
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
}, {
    title?: string | undefined;
    metadata?: {
        custom?: Record<string, any> | undefined;
        summary?: string | undefined;
        tags?: string[] | undefined;
        userId?: string | undefined;
        category?: string | undefined;
        userName?: string | undefined;
        modelId?: string | undefined;
    } | undefined;
    initialMessages?: {
        content: string;
        role: "function" | "tool" | "data" | "user" | "system" | "assistant";
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
}>;
export declare const GetConversationSchema: z.ZodObject<{
    conversationId: z.ZodString;
    anonymize: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    conversationId: string;
    anonymize: boolean;
}, {
    conversationId: string;
    anonymize?: boolean | undefined;
}>;
export declare const ListConversationsSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["createdAt", "updatedAt"]>>>;
    sortDirection: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
    userId: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    category: z.ZodOptional<z.ZodString>;
    includeMesages: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    anonymize: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    sortBy: "createdAt" | "updatedAt";
    sortDirection: "asc" | "desc";
    offset: number;
    anonymize: boolean;
    includeMesages: boolean;
    tags?: string[] | undefined;
    userId?: string | undefined;
    category?: string | undefined;
}, {
    limit?: number | undefined;
    sortBy?: "createdAt" | "updatedAt" | undefined;
    tags?: string[] | undefined;
    sortDirection?: "asc" | "desc" | undefined;
    userId?: string | undefined;
    category?: string | undefined;
    offset?: number | undefined;
    anonymize?: boolean | undefined;
    includeMesages?: boolean | undefined;
}>;
export declare const SearchMessagesSchema: z.ZodObject<{
    query: z.ZodString;
    conversationId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodNumber>;
    endDate: z.ZodOptional<z.ZodNumber>;
    role: z.ZodOptional<z.ZodEnum<["user", "assistant", "system", "function", "tool", "data"]>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    includeMetadata: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    anonymize: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    includeMetadata: boolean;
    limit: number;
    query: string;
    offset: number;
    anonymize: boolean;
    userId?: string | undefined;
    conversationId?: string | undefined;
    role?: "function" | "tool" | "data" | "user" | "system" | "assistant" | undefined;
    startDate?: number | undefined;
    endDate?: number | undefined;
}, {
    query: string;
    includeMetadata?: boolean | undefined;
    limit?: number | undefined;
    userId?: string | undefined;
    offset?: number | undefined;
    conversationId?: string | undefined;
    role?: "function" | "tool" | "data" | "user" | "system" | "assistant" | undefined;
    anonymize?: boolean | undefined;
    startDate?: number | undefined;
    endDate?: number | undefined;
}>;
export declare const ExportConversationSchema: z.ZodObject<{
    conversationId: z.ZodString;
    format: z.ZodDefault<z.ZodEnum<["json", "text", "html", "csv", "markdown"]>>;
    anonymize: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeMetadata: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    outputPath: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    format: "text" | "json" | "markdown" | "html" | "csv";
    includeMetadata: boolean;
    conversationId: string;
    anonymize: boolean;
    outputPath?: string | undefined;
}, {
    conversationId: string;
    format?: "text" | "json" | "markdown" | "html" | "csv" | undefined;
    outputPath?: string | undefined;
    includeMetadata?: boolean | undefined;
    anonymize?: boolean | undefined;
}>;
export declare const UpdateSettingsSchema: z.ZodObject<{
    retentionPolicy: z.ZodOptional<z.ZodObject<{
        maxConversationAge: z.ZodOptional<z.ZodNumber>;
        maxMessagesPerConversation: z.ZodOptional<z.ZodNumber>;
        maxConversations: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxConversationAge?: number | undefined;
        maxMessagesPerConversation?: number | undefined;
        maxConversations?: number | undefined;
    }, {
        maxConversationAge?: number | undefined;
        maxMessagesPerConversation?: number | undefined;
        maxConversations?: number | undefined;
    }>>;
    anonymizationEnabled: z.ZodOptional<z.ZodBoolean>;
    exportEnabled: z.ZodOptional<z.ZodBoolean>;
    searchEnabled: z.ZodOptional<z.ZodBoolean>;
    analyticsEnabled: z.ZodOptional<z.ZodBoolean>;
    encryptionEnabled: z.ZodOptional<z.ZodBoolean>;
    encryptionKey: z.ZodOptional<z.ZodString>;
    applyRetentionPolicy: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    applyRetentionPolicy: boolean;
    retentionPolicy?: {
        maxConversationAge?: number | undefined;
        maxMessagesPerConversation?: number | undefined;
        maxConversations?: number | undefined;
    } | undefined;
    anonymizationEnabled?: boolean | undefined;
    exportEnabled?: boolean | undefined;
    searchEnabled?: boolean | undefined;
    analyticsEnabled?: boolean | undefined;
    encryptionEnabled?: boolean | undefined;
    encryptionKey?: string | undefined;
}, {
    retentionPolicy?: {
        maxConversationAge?: number | undefined;
        maxMessagesPerConversation?: number | undefined;
        maxConversations?: number | undefined;
    } | undefined;
    anonymizationEnabled?: boolean | undefined;
    exportEnabled?: boolean | undefined;
    searchEnabled?: boolean | undefined;
    analyticsEnabled?: boolean | undefined;
    encryptionEnabled?: boolean | undefined;
    encryptionKey?: string | undefined;
    applyRetentionPolicy?: boolean | undefined;
}>;

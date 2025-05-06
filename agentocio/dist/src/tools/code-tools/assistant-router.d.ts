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
 * Handles assistant-router commands
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
export declare const RouteRequestSchema: z.ZodObject<{
    input: z.ZodRecord<z.ZodString, z.ZodAny>;
    analyzeOnly: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    input: Record<string, any>;
    analyzeOnly: boolean;
}, {
    input: Record<string, any>;
    analyzeOnly?: boolean | undefined;
}>;
export declare const AddAssistantSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["coder", "writer", "researcher", "analyst", "designer", "planner", "teacher", "expert", "custom"]>;
    description: z.ZodString;
    capabilities: z.ZodArray<z.ZodString, "many">;
    parameters: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    model: z.ZodOptional<z.ZodString>;
    contextLimit: z.ZodOptional<z.ZodNumber>;
    temperature: z.ZodOptional<z.ZodNumber>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    requiredFields: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "custom" | "coder" | "writer" | "researcher" | "analyst" | "designer" | "planner" | "teacher" | "expert";
    description: string;
    enabled: boolean;
    parameters: Record<string, any>;
    capabilities: string[];
    model?: string | undefined;
    contextLimit?: number | undefined;
    temperature?: number | undefined;
    systemPrompt?: string | undefined;
    requiredFields?: string[] | undefined;
}, {
    name: string;
    type: "custom" | "coder" | "writer" | "researcher" | "analyst" | "designer" | "planner" | "teacher" | "expert";
    description: string;
    capabilities: string[];
    enabled?: boolean | undefined;
    parameters?: Record<string, any> | undefined;
    model?: string | undefined;
    contextLimit?: number | undefined;
    temperature?: number | undefined;
    systemPrompt?: string | undefined;
    requiredFields?: string[] | undefined;
}>;
export declare const AddRuleSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    priority: z.ZodNumber;
    conditions: z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        operator: z.ZodEnum<["equals", "contains", "startsWith", "endsWith", "matches", "exists"]>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        valueList: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        operator: "endsWith" | "startsWith" | "equals" | "contains" | "matches" | "exists";
        field: string;
        value?: string | number | boolean | undefined;
        valueList?: (string | number | boolean)[] | undefined;
    }, {
        operator: "endsWith" | "startsWith" | "equals" | "contains" | "matches" | "exists";
        field: string;
        value?: string | number | boolean | undefined;
        valueList?: (string | number | boolean)[] | undefined;
    }>, "many">;
    targetAssistantId: z.ZodString;
    fallbackAssistantId: z.ZodOptional<z.ZodString>;
    enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    enabled: boolean;
    conditions: {
        operator: "endsWith" | "startsWith" | "equals" | "contains" | "matches" | "exists";
        field: string;
        value?: string | number | boolean | undefined;
        valueList?: (string | number | boolean)[] | undefined;
    }[];
    priority: number;
    targetAssistantId: string;
    metadata?: Record<string, any> | undefined;
    fallbackAssistantId?: string | undefined;
}, {
    name: string;
    description: string;
    conditions: {
        operator: "endsWith" | "startsWith" | "equals" | "contains" | "matches" | "exists";
        field: string;
        value?: string | number | boolean | undefined;
        valueList?: (string | number | boolean)[] | undefined;
    }[];
    priority: number;
    targetAssistantId: string;
    metadata?: Record<string, any> | undefined;
    enabled?: boolean | undefined;
    fallbackAssistantId?: string | undefined;
}>;
export declare const ListAssistantsSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodOptional<z.ZodEnum<["coder", "writer", "researcher", "analyst", "designer", "planner", "teacher", "expert", "custom", "all"]>>>;
    enabledOnly: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeSystemPrompt: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    type: "custom" | "all" | "coder" | "writer" | "researcher" | "analyst" | "designer" | "planner" | "teacher" | "expert";
    enabledOnly: boolean;
    includeSystemPrompt: boolean;
}, {
    type?: "custom" | "all" | "coder" | "writer" | "researcher" | "analyst" | "designer" | "planner" | "teacher" | "expert" | undefined;
    enabledOnly?: boolean | undefined;
    includeSystemPrompt?: boolean | undefined;
}>;
export declare const ListRulesSchema: z.ZodObject<{
    enabledOnly: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    targetAssistantId: z.ZodOptional<z.ZodString>;
    includeConditions: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sortByPriority: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    enabledOnly: boolean;
    includeConditions: boolean;
    sortByPriority: boolean;
    targetAssistantId?: string | undefined;
}, {
    enabledOnly?: boolean | undefined;
    targetAssistantId?: string | undefined;
    includeConditions?: boolean | undefined;
    sortByPriority?: boolean | undefined;
}>;
export declare const GetHistorySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    assistantId: z.ZodOptional<z.ZodString>;
    ruleId: z.ZodOptional<z.ZodString>;
    successOnly: z.ZodOptional<z.ZodBoolean>;
    includeInputs: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    includeInputs: boolean;
    ruleId?: string | undefined;
    assistantId?: string | undefined;
    successOnly?: boolean | undefined;
}, {
    limit?: number | undefined;
    offset?: number | undefined;
    ruleId?: string | undefined;
    assistantId?: string | undefined;
    successOnly?: boolean | undefined;
    includeInputs?: boolean | undefined;
}>;
export declare const UpdateConfigSchema: z.ZodObject<{
    defaultAssistantId: z.ZodOptional<z.ZodString>;
    maxHistoryEntries: z.ZodOptional<z.ZodNumber>;
    requireAllConditions: z.ZodOptional<z.ZodBoolean>;
    enableLogging: z.ZodOptional<z.ZodBoolean>;
    logLevel: z.ZodOptional<z.ZodEnum<["debug", "info", "warn", "error"]>>;
    analysisMode: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    logLevel?: "error" | "debug" | "info" | "warn" | undefined;
    defaultAssistantId?: string | undefined;
    maxHistoryEntries?: number | undefined;
    requireAllConditions?: boolean | undefined;
    enableLogging?: boolean | undefined;
    analysisMode?: boolean | undefined;
}, {
    logLevel?: "error" | "debug" | "info" | "warn" | undefined;
    defaultAssistantId?: string | undefined;
    maxHistoryEntries?: number | undefined;
    requireAllConditions?: boolean | undefined;
    enableLogging?: boolean | undefined;
    analysisMode?: boolean | undefined;
}>;

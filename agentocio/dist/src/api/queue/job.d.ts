/**
 * Job Model
 *
 * This file defines the Job class that represents a single task in the job queue.
 */
export declare enum JobStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare enum JobPriority {
    LOW = 0,
    NORMAL = 1,
    HIGH = 2,
    CRITICAL = 3
}
export interface JobData {
    id?: string;
    name: string;
    type: string;
    status?: JobStatus;
    priority?: JobPriority;
    payload: any;
    progress?: number;
    result?: any;
    error?: string;
    createdAt?: string;
    startedAt?: string;
    completedAt?: string;
    retries?: number;
    maxRetries?: number;
    timeout?: number;
    metadata?: Record<string, any>;
}
/**
 * Job class represents a single task in the job queue
 */
export declare class Job implements JobData {
    id: string;
    name: string;
    type: string;
    status: JobStatus;
    priority: JobPriority;
    payload: any;
    progress: number;
    result?: any;
    error?: string;
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
    retries: number;
    maxRetries: number;
    timeout: number;
    metadata: Record<string, any>;
    constructor(data: JobData);
    /**
     * Start a job
     */
    start(): Job;
    /**
     * Complete a job successfully
     */
    complete(result?: any): Job;
    /**
     * Mark a job as failed
     */
    fail(error: Error | string): Job;
    /**
     * Cancel a job
     */
    cancel(): Job;
    /**
     * Update job progress
     */
    updateProgress(progress: number): Job;
    /**
     * Check if job is active (pending or running)
     */
    isActive(): boolean;
    /**
     * Check if job has completed (successfully or not)
     */
    isComplete(): boolean;
    /**
     * Check if job has timed out
     */
    hasTimedOut(): boolean;
    /**
     * Serialize job to JSON
     */
    toJSON(): JobData;
    /**
     * Create a job from JSON
     */
    static fromJSON(data: JobData): Job;
}
export default Job;

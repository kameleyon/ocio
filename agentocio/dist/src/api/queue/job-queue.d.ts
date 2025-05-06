/**
 * Job Queue Manager
 *
 * This file implements the JobQueue class that manages job execution,
 * persistence, and concurrency control.
 */
import { EventEmitter } from 'events';
import { Job, JobStatus } from './job.js';
import { Storage } from '../storage/index.js';
import { JobCreationParams } from './index.js';
export type JobHandler = (job: Job) => Promise<any>;
/**
 * Job Queue Manager
 */
export declare class JobQueue extends EventEmitter {
    private storage;
    private handlers;
    private activeJobs;
    private maxConcurrency;
    private running;
    private interval;
    constructor(storage: Storage);
    /**
     * Start the job queue processing
     */
    start(): void;
    /**
     * Stop the job queue processing
     */
    stop(): void;
    /**
     * Register a job handler
     */
    registerHandler(jobType: string, handler: JobHandler): void;
    /**
     * Create a new job
     */
    createJob(params: JobCreationParams): Promise<Job>;
    /**
     * Process pending jobs
     */
    private processJobs;
    /**
     * Execute a single job
     */
    private executeJob;
    /**
     * Get a job by ID
     */
    getJob(id: string): Promise<Job | null>;
    /**
     * Cancel a job
     */
    cancelJob(id: string): Promise<Job | null>;
    /**
     * Get all jobs, optionally filtered by status
     */
    getJobs(status?: JobStatus): Promise<Job[]>;
    /**
     * Clear all jobs
     */
    clearJobs(): Promise<void>;
}
export default JobQueue;

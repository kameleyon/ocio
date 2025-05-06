/**
 * Job Queue System
 *
 * This module provides a job queue system for handling long-running tasks
 * and managing asynchronous processes in the OptimusCode API.
 */
import { Storage } from '../storage/index.js';
import { JobQueue } from './job-queue.js';
import { Job, JobStatus, JobPriority } from './job.js';
/**
 * Simplified interface for job creation
 * This allows creation of jobs with only the essential parameters
 */
export interface JobCreationParams {
    name: string;
    type: string;
    priority?: JobPriority;
    payload: any;
    metadata?: Record<string, any>;
    maxRetries?: number;
    timeout?: number;
}
export { Job, JobStatus, JobPriority, JobQueue };
/**
 * Initialize the job queue system
 */
export declare function initializeJobQueue(storage?: Storage): Promise<JobQueue>;
declare const _default: {
    initializeJobQueue: typeof initializeJobQueue;
    Job: typeof Job;
    JobStatus: typeof JobStatus;
    JobPriority: typeof JobPriority;
};
export default _default;

/**
 * Job Model
 *
 * This file defines the Job class that represents a single task in the job queue.
 */
import { v4 as uuidv4 } from 'uuid';
// Job status enum
export var JobStatus;
(function (JobStatus) {
    JobStatus["PENDING"] = "pending";
    JobStatus["RUNNING"] = "running";
    JobStatus["COMPLETED"] = "completed";
    JobStatus["FAILED"] = "failed";
    JobStatus["CANCELLED"] = "cancelled";
})(JobStatus || (JobStatus = {}));
// Job priority enum
export var JobPriority;
(function (JobPriority) {
    JobPriority[JobPriority["LOW"] = 0] = "LOW";
    JobPriority[JobPriority["NORMAL"] = 1] = "NORMAL";
    JobPriority[JobPriority["HIGH"] = 2] = "HIGH";
    JobPriority[JobPriority["CRITICAL"] = 3] = "CRITICAL";
})(JobPriority || (JobPriority = {}));
/**
 * Job class represents a single task in the job queue
 */
export class Job {
    id;
    name;
    type;
    status;
    priority;
    payload;
    progress;
    result;
    error;
    createdAt;
    startedAt;
    completedAt;
    retries;
    maxRetries;
    timeout;
    metadata;
    constructor(data) {
        this.id = data.id || uuidv4();
        this.name = data.name;
        this.type = data.type;
        this.status = data.status || JobStatus.PENDING;
        this.priority = data.priority || JobPriority.NORMAL;
        this.payload = data.payload;
        this.progress = data.progress || 0;
        this.result = data.result;
        this.error = data.error;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.startedAt = data.startedAt;
        this.completedAt = data.completedAt;
        this.retries = data.retries || 0;
        this.maxRetries = data.maxRetries || 3;
        this.timeout = data.timeout || 30 * 60 * 1000; // 30 minutes
        this.metadata = data.metadata || {};
    }
    /**
     * Start a job
     */
    start() {
        this.status = JobStatus.RUNNING;
        this.startedAt = new Date().toISOString();
        this.progress = 0;
        return this;
    }
    /**
     * Complete a job successfully
     */
    complete(result) {
        this.status = JobStatus.COMPLETED;
        this.completedAt = new Date().toISOString();
        this.progress = 100;
        this.result = result;
        return this;
    }
    /**
     * Mark a job as failed
     */
    fail(error) {
        this.status = JobStatus.FAILED;
        this.completedAt = new Date().toISOString();
        this.error = typeof error === 'string' ? error : error.message;
        // Check if we should retry
        if (this.retries < this.maxRetries) {
            this.status = JobStatus.PENDING;
            this.retries += 1;
            this.startedAt = undefined;
            this.completedAt = undefined;
        }
        return this;
    }
    /**
     * Cancel a job
     */
    cancel() {
        this.status = JobStatus.CANCELLED;
        this.completedAt = new Date().toISOString();
        return this;
    }
    /**
     * Update job progress
     */
    updateProgress(progress) {
        this.progress = Math.min(Math.max(progress, 0), 100);
        return this;
    }
    /**
     * Check if job is active (pending or running)
     */
    isActive() {
        return this.status === JobStatus.PENDING || this.status === JobStatus.RUNNING;
    }
    /**
     * Check if job has completed (successfully or not)
     */
    isComplete() {
        return [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED].includes(this.status);
    }
    /**
     * Check if job has timed out
     */
    hasTimedOut() {
        if (!this.startedAt)
            return false;
        const startTime = new Date(this.startedAt).getTime();
        const currentTime = Date.now();
        return currentTime - startTime > this.timeout;
    }
    /**
     * Serialize job to JSON
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            status: this.status,
            priority: this.priority,
            payload: this.payload,
            progress: this.progress,
            result: this.result,
            error: this.error,
            createdAt: this.createdAt,
            startedAt: this.startedAt,
            completedAt: this.completedAt,
            retries: this.retries,
            maxRetries: this.maxRetries,
            timeout: this.timeout,
            metadata: this.metadata
        };
    }
    /**
     * Create a job from JSON
     */
    static fromJSON(data) {
        return new Job(data);
    }
}
export default Job;
//# sourceMappingURL=job.js.map
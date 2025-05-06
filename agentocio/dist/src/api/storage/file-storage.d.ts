/**
 * File-based Storage System
 *
 * This module provides a file-based implementation of the storage system
 * that persists data to JSON files in the filesystem.
 */
/**
 * File-based storage implementation
 */
export declare class FileStorage {
    constructor();
    /**
     * Create collections (subdirectories)
     */
    private createCollections;
    /**
     * Get the file path for a document
     */
    private getFilePath;
    /**
     * Create a new document in a collection
     */
    create<T extends {
        id?: string;
    }>(collection: string, data: T): Promise<T>;
    /**
     * Find a document by ID
     */
    findById<T>(collection: string, id: string): Promise<T | null>;
    /**
     * Find documents in a collection with optional filtering
     */
    find<T>(collection: string, filter?: Partial<T>): Promise<T[]>;
    /**
     * Update a document by ID
     */
    updateById<T>(collection: string, id: string, data: Partial<T>): Promise<T | null>;
    /**
     * Delete a document by ID
     */
    deleteById(collection: string, id: string): Promise<boolean>;
    /**
     * Delete all documents in a collection
     */
    deleteAll(collection: string): Promise<boolean>;
}
export default FileStorage;

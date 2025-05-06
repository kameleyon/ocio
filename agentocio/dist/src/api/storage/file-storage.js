/**
 * File-based Storage System
 *
 * This module provides a file-based implementation of the storage system
 * that persists data to JSON files in the filesystem.
 */
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';
// Base directory for file storage
const baseDir = path.resolve(process.cwd(), config.storage.filePath || './data');
/**
 * File-based storage implementation
 */
export class FileStorage {
    constructor() {
        // Ensure the base directory exists
        fs.ensureDirSync(baseDir);
        // Create subdirectories for each collection
        this.createCollections([
            'prompts',
            'tools',
            'jobs',
            'sessions',
            'apps',
            'metadata'
        ]);
    }
    /**
     * Create collections (subdirectories)
     */
    createCollections(collections) {
        for (const collection of collections) {
            fs.ensureDirSync(path.join(baseDir, collection));
        }
    }
    /**
     * Get the file path for a document
     */
    getFilePath(collection, id) {
        return path.join(baseDir, collection, `${id}.json`);
    }
    /**
     * Create a new document in a collection
     */
    async create(collection, data) {
        // Generate an ID if not provided
        if (!data.id) {
            data = { ...data, id: uuidv4() };
        }
        // Add timestamps
        const document = {
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        // Write the document to a file
        const filePath = this.getFilePath(collection, document.id);
        await fs.writeJson(filePath, document, { spaces: 2 });
        return document;
    }
    /**
     * Find a document by ID
     */
    async findById(collection, id) {
        const filePath = this.getFilePath(collection, id);
        try {
            if (await fs.pathExists(filePath)) {
                return await fs.readJson(filePath);
            }
            return null;
        }
        catch (error) {
            console.error(`Error reading ${filePath}:`, error);
            return null;
        }
    }
    /**
     * Find documents in a collection with optional filtering
     */
    async find(collection, filter) {
        try {
            const collectionPath = path.join(baseDir, collection);
            const files = await fs.readdir(collectionPath);
            const documents = [];
            for (const file of files) {
                if (path.extname(file) === '.json') {
                    try {
                        const filePath = path.join(collectionPath, file);
                        const document = await fs.readJson(filePath);
                        // Apply filter if provided
                        if (filter) {
                            const matches = Object.entries(filter).every(([key, value]) => {
                                return document[key] === value;
                            });
                            if (matches) {
                                documents.push(document);
                            }
                        }
                        else {
                            documents.push(document);
                        }
                    }
                    catch (error) {
                        console.error(`Error reading ${file}:`, error);
                    }
                }
            }
            return documents;
        }
        catch (error) {
            console.error(`Error reading collection ${collection}:`, error);
            return [];
        }
    }
    /**
     * Update a document by ID
     */
    async updateById(collection, id, data) {
        const filePath = this.getFilePath(collection, id);
        try {
            if (await fs.pathExists(filePath)) {
                const document = await fs.readJson(filePath);
                // Update the document with new data
                const updatedDocument = {
                    ...document,
                    ...data,
                    updatedAt: new Date().toISOString()
                };
                // Write the updated document back to the file
                await fs.writeJson(filePath, updatedDocument, { spaces: 2 });
                return updatedDocument;
            }
            return null;
        }
        catch (error) {
            console.error(`Error updating ${filePath}:`, error);
            return null;
        }
    }
    /**
     * Delete a document by ID
     */
    async deleteById(collection, id) {
        const filePath = this.getFilePath(collection, id);
        try {
            if (await fs.pathExists(filePath)) {
                await fs.unlink(filePath);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error(`Error deleting ${filePath}:`, error);
            return false;
        }
    }
    /**
     * Delete all documents in a collection
     */
    async deleteAll(collection) {
        const collectionPath = path.join(baseDir, collection);
        try {
            await fs.emptyDir(collectionPath);
            return true;
        }
        catch (error) {
            console.error(`Error emptying collection ${collection}:`, error);
            return false;
        }
    }
}
export default FileStorage;
//# sourceMappingURL=file-storage.js.map
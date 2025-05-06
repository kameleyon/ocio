/**
 * Storage System
 *
 * This module provides a unified interface for persistent storage,
 * supporting both file-based and MongoDB storage backends.
 */
import FileStorage from './file-storage.js';
export interface Storage {
    create<T extends Record<string, any>>(collection: string, data: T): Promise<T>;
    findById<T>(collection: string, id: string): Promise<T | null>;
    find<T>(collection: string, filter?: Partial<T>): Promise<T[]>;
    updateById<T>(collection: string, id: string, data: Partial<T>): Promise<T | null>;
    deleteById(collection: string, id: string): Promise<boolean>;
    deleteAll(collection: string): Promise<boolean>;
}
export declare function initializeStorage(): Storage;
export { FileStorage };
declare const _default: {
    initializeStorage: typeof initializeStorage;
};
export default _default;

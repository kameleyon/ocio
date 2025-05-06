/**
 * Storage System
 *
 * This module provides a unified interface for persistent storage,
 * supporting both file-based and MongoDB storage backends.
 */
import { config } from '../config.js';
import FileStorage from './file-storage.js';
// Factory function to create the appropriate storage instance
export function initializeStorage() {
    const storageType = config.storage.type.toLowerCase();
    switch (storageType) {
        case 'mongodb':
            // When MongoDB implementation is ready, use it
            // return new MongoStorage(config.storage.mongoUri);
            console.warn('MongoDB storage requested but not implemented yet. Using file storage instead.');
            return new FileStorage();
        case 'file':
        default:
            return new FileStorage();
    }
}
// Export the storage implementation types
export { FileStorage };
// Export default for ESM compatibility
export default {
    initializeStorage
};
//# sourceMappingURL=index.js.map
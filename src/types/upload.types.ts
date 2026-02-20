// Upload resource returned from API (backend-first)
export interface UploadResource {
    // ✅ canonical image pipeline
    proxy_url?: string;
}

// Upload request parameters
export interface UploadRequest {
    file: File;
    priority?: number;
}
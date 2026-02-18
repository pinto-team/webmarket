// Upload resource returned from API (backend-first)
export interface UploadResource {
    // backend image pipeline (preferred)
    proxy_url?: string;

    // legacy fields (keep optional; DO NOT use directly in UI)
    main_url?: string;
    thumb_url?: string;
}

// Upload request parameters
export interface UploadRequest {
    file: File;
    priority?: number;
}

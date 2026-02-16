// Upload resource returned from API
export interface UploadResource {
  main_url: string;
  thumb_url?: string;
}

// Upload request parameters
export interface UploadRequest {
  file: File;
  priority?: number;
}

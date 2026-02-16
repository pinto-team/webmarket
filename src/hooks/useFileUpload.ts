import { useState } from "react";
import { uploadFile } from "@/services/upload.service";
import { UploadResource } from "@/types/ticket.types";

interface UploadedFile {
  file: File;
  uploadId?: number;
  uploading: boolean;
  error?: string;
  resource?: UploadResource;
}

export const useFileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles = newFiles.map(file => ({
      file,
      uploading: false,
    }));
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const uploadPromises = files.map(async (fileItem, index) => {
      if (fileItem.uploadId) return;

      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, uploading: true, error: undefined } : f
      ));

      try {
        const resource = await uploadFile(fileItem.file);
        setFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, uploadId: resource.id, resource, uploading: false } : f
        ));
      } catch (err: any) {
        setFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, uploading: false, error: err.message } : f
        ));
        throw err;
      }
    });

    await Promise.all(uploadPromises);
  };

  const getUploadIds = (): number[] => {
    return files.filter(f => f.uploadId).map(f => f.uploadId!);
  };

  const reset = () => {
    setFiles([]);
  };

  return { files, addFiles, removeFile, uploadFiles, getUploadIds, reset };
};

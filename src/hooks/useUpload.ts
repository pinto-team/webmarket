import { useState } from "react";
import { uploadFile } from "@/services/upload.service";

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, priority?: number) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadFile(file, priority);
      setProgress(100);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در آپلود فایل");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress, error };
};

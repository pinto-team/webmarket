"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { useFileUpload } from "@/hooks/useFileUpload";
import FileUploadZone from "@/components/file-upload/FileUploadZone";
import FilePreview from "@/components/file-upload/FilePreview";

interface TicketReplyFormProps {
  onSubmit: (description: string, uploadIds: number[]) => Promise<void>;
  onCancel?: () => void;
}

export default function TicketReplyForm({ onSubmit, onCancel }: TicketReplyFormProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { files, addFiles, removeFile, uploadFiles, getUploadIds, reset } = useFileUpload();

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("لطفا پیام خود را وارد کنید");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (files.length > 0) {
        await uploadFiles();
      }
      
      await onSubmit(description, getUploadIds());
      setDescription("");
      reset();
    } catch (err: any) {
      setError(err.message || "خطا در ارسال پاسخ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={3}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="پیام خود را بنویسید..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />

      <Box mt={2}>
        <FileUploadZone onFilesSelected={addFiles} />
        {files.length > 0 && (
          <Stack spacing={1} mt={2}>
            {files.map((file, index) => (
              <FilePreview
                key={index}
                file={file.file}
                resource={file.resource}
                uploading={file.uploading}
                error={file.error}
                onRemove={() => removeFile(index)}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "در حال ارسال..." : "ارسال پاسخ"}
        </Button>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            انصراف
          </Button>
        )}
      </Box>
    </Box>
  );
}

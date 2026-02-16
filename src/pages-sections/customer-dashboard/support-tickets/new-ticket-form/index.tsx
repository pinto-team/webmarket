"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useFileUpload } from "@/hooks/useFileUpload";
import FileUploadZone from "@/components/file-upload/FileUploadZone";
import FilePreview from "@/components/file-upload/FilePreview";

interface NewTicketFormProps {
  onSubmit: (description: string, uploadIds: number[]) => Promise<void>;
  onCancel?: () => void;
}

export default function NewTicketForm({ onSubmit, onCancel }: NewTicketFormProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { files, addFiles, removeFile, uploadFiles, getUploadIds, reset } = useFileUpload();

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("لطفا توضیحات تیکت را وارد کنید");
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
      setError(err.message || "خطا در ایجاد تیکت");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" mb={2}>ایجاد تیکت جدید</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        multiline
        rows={6}
        placeholder="موضوع و توضیحات تیکت خود را بنویسید..."
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

      <Box display="flex" gap={2} mt={3}>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "در حال ارسال..." : "ایجاد تیکت"}
        </Button>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            انصراف
          </Button>
        )}
      </Box>
    </Paper>
  );
}

"use client";

import { useState } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { useFileUpload } from "@/hooks/useFileUpload";
import FilePreview from "@/components/file-upload/FilePreview";
import FileUploadZone from "@/components/file-upload/FileUploadZone";
import { t } from "@/i18n/t";

interface TicketReplyFormProps {
    onSubmit: (description: string, uploadIds: number[]) => Promise<void>;
    onCancel?: () => void;
}

export default function TicketReplyForm({
                                            onSubmit,
                                            onCancel,
                                        }: TicketReplyFormProps) {
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        files,
        addFiles,
        removeFile,
        uploadFiles,
        getUploadIds,
        reset,
    } = useFileUpload();

    const handleSubmit = async () => {
        if (!description.trim()) {
            setError(t("tickets.validation.descriptionRequired"));
            return;
        }

        try {
            setError(null);
            setLoading(true);

            if (files.length > 0) {
                await uploadFiles();
            }

            await onSubmit(description, getUploadIds());

            setDescription("");
            reset();
        } catch (err: any) {
            setError(err?.message || t("errors.general"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box mt={3}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                fullWidth
                disabled={loading}
                multiline
                rows={4}
                placeholder={t("tickets.descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <Box mt={2}>
                <FileUploadZone onFilesSelected={addFiles} />

                {files.length > 0 && (
                    <Stack spacing={1} mt={2}>
                        {files.map((file, index) => (
                            <FilePreview
                                key={index}
                                error={file.error}
                                file={file.file}
                                resource={file.resource}
                                uploading={file.uploading}
                                onRemove={() => removeFile(index)}
                            />
                        ))}
                    </Stack>
                )}
            </Box>

            <Box display="flex" gap={2} mt={2}>
                <Button
                    disabled={loading}
                    onClick={handleSubmit}
                    variant="contained"
                >
                    {loading ? t("common.submitting") : t("tickets.create")}
                </Button>

                {onCancel && (
                    <Button
                        disabled={loading}
                        onClick={onCancel}
                        variant="outlined"
                    >
                        {t("common.cancel")}
                    </Button>
                )}
            </Box>
        </Box>
    );
}

"use client";

import { useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloudUpload from "@mui/icons-material/CloudUpload";

import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

interface FileUploadZoneProps {
    onFilesSelected: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/zip"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export default function FileUploadZone({
                                           onFilesSelected,
                                           accept,
                                           multiple = true,
                                       }: FileUploadZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const effectiveAccept = accept || t("files.accept");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validFiles = selectedFiles.filter((file) => {
            if (!ALLOWED_TYPES.includes(file.type)) return false;
            if (file.size > MAX_SIZE_BYTES) return false;
            return true;
        });

        if (validFiles.length > 0) onFilesSelected(validFiles);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <Box>
            <input
                ref={inputRef}
                type="file"
                accept={effectiveAccept}
                multiple={multiple}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => inputRef.current?.click()}
                fullWidth
            >
                {t("files.select")}
            </Button>

            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                {t("files.allowedFormatsWithMax", {
                    formats: t("files.allowedFormats"),
                    maxMb: toPersianNumber(10),
                })}
            </Typography>
        </Box>
    );
}

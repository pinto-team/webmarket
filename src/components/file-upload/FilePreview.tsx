"use client";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Close from "@mui/icons-material/Close";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import Download from "@mui/icons-material/Download";

import { UploadResource } from "@/types/ticket.types";
import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

interface FilePreviewProps {
    file?: File;
    resource?: UploadResource;
    uploading?: boolean;
    error?: string;
    onRemove?: () => void;
}

export default function FilePreview({
                                        file,
                                        resource,
                                        uploading,
                                        error,
                                        onRemove,
                                    }: FilePreviewProps) {
    const fileName = file?.name || resource?.title || t("files.defaultName");

    const fileSize =
        file ? `${toPersianNumber((file.size / 1024).toFixed(1))} ${t("files.kb")}` : "";

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1}
            p={1}
            border={1}
            borderColor={error ? "error.main" : "divider"}
            borderRadius={1}
            bgcolor="background.paper"
        >
            <InsertDriveFile color={error ? "error" : "action"} />

            <Box flex={1} minWidth={0}>
                <Typography variant="body2" noWrap>
                    {fileName}
                </Typography>

                {fileSize && (
                    <Typography variant="caption" color="text.secondary">
                        {fileSize}
                    </Typography>
                )}

                {error && (
                    <Typography variant="caption" color="error">
                        {error}
                    </Typography>
                )}
            </Box>

            {uploading && <CircularProgress size={20} />}

            {resource?.main_url && (
                <IconButton
                    size="small"
                    component="a"
                    href={resource.main_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Download fontSize="small" />
                </IconButton>
            )}


            {onRemove && !uploading && (
                <IconButton size="small" onClick={onRemove}>
                    <Close fontSize="small" />
                </IconButton>
            )}
        </Box>
    );
}

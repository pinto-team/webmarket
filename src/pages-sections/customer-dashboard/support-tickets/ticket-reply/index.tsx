"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Reply from "@mui/icons-material/Reply";

import { TicketReplyResource } from "@/types/ticket.types";
import FilePreview from "@/components/file-upload/FilePreview";

import { t } from "@/i18n/t";
import { formatPersianDateTime } from "@/utils/persian";
import { getServerImageUrl, isPlaceholderProductImage } from "@/utils/imageUtils";

interface TicketReplyProps {
    reply: TicketReplyResource;
    isCustomer?: boolean;
    onReply?: () => void;
}

export default function TicketReply({ reply, isCustomer, onReply }: TicketReplyProps) {
    const author = reply.ownerable;
    const authorName = author?.title || author?.first_name || t("common.unknown");

    // ✅ proxy-only avatar
    const avatarCandidate = getServerImageUrl(author, "80x80", 75);
    const avatarSrc = !isPlaceholderProductImage(avatarCandidate) ? avatarCandidate : undefined;

    return (
        <Box display="flex" gap={2} mb={3} flexDirection={isCustomer ? "row-reverse" : "row"}>
            <Avatar src={avatarSrc} sx={{ width: 40, height: 40 }}>
                {authorName?.[0]}
            </Avatar>

            <Box flex={1}>
                <Paper
                    sx={{
                        p: 2,
                        bgcolor: isCustomer ? "primary.lighter" : "background.paper",
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2">{authorName}</Typography>

                        {!isCustomer && onReply && (
                            <Button size="small" startIcon={<Reply />} onClick={onReply}>
                                {t("common.submit")}
                            </Button>
                        )}
                    </Box>

                    <Typography variant="body2" whiteSpace="pre-wrap">
                        {reply.description}
                    </Typography>

                    {Array.isArray(reply.uploads) && reply.uploads.length > 0 && (
                        <Stack spacing={1} mt={2}>
                            {reply.uploads.map((upload) => (
                                <FilePreview key={upload.id} resource={upload} />
                            ))}
                        </Stack>
                    )}
                </Paper>

                <Typography
                    variant="caption"
                    color="text.disabled"
                    display="block"
                    mt={0.5}
                    textAlign={isCustomer ? "right" : "left"}
                >
                    {formatPersianDateTime(reply.created_at)}
                </Typography>
            </Box>
        </Box>
    );
}
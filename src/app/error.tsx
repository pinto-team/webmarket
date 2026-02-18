"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import BugReportIcon from "@mui/icons-material/BugReport";

import { t } from "@/i18n/t";

const StyledRoot = styled("div")(() => ({
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    "& .MuiCard-root": { width: "100%", maxWidth: 760, padding: "24px" },
}));

interface Props {
    reset: () => void;
    error: Error & { digest?: string };
}

function safeString(v: unknown) {
    try {
        if (v == null) return "";
        if (typeof v === "string") return v;
        if (typeof v === "number" || typeof v === "boolean") return String(v);
        return JSON.stringify(v, null, 2);
    } catch {
        return String(v);
    }
}

export default function ErrorPage({ error, reset }: Props) {
    const [showDetails, setShowDetails] = useState(false);
    const isDev = process.env.NODE_ENV !== "production";

    const payload = useMemo(() => {
        const anyErr = error as any;

        return {
            name: anyErr?.name || "Error",
            message: anyErr?.message || "",
            digest: anyErr?.digest || "",
            cause: anyErr?.cause ? safeString(anyErr.cause) : "",
            stack: anyErr?.stack || "",
            status: anyErr?.status ?? anyErr?.response?.status ?? "",
            url: anyErr?.config?.url ?? "",
            method: anyErr?.config?.method ?? "",
            serverMessage: anyErr?.response?.data?.message ?? "",
            serverErrors: anyErr?.response?.data?.errors ?? "",
        };
    }, [error]);

    const prettyText = useMemo(() => {
        const lines: string[] = [];
        lines.push(`${payload.name}: ${payload.message}`);
        if (payload.digest) lines.push(`${t("errors.labels.digest")}: ${payload.digest}`);
        if (payload.status) lines.push(`${t("errors.labels.status")}: ${payload.status}`);
        if (payload.method || payload.url) {
            lines.push(
                `${t("errors.labels.request")}: ${payload.method || ""} ${payload.url || ""}`.trim()
            );
        }
        if (payload.serverMessage) lines.push(`${t("errors.labels.serverMessage")}: ${payload.serverMessage}`);
        if (payload.serverErrors) lines.push(`${t("errors.labels.serverErrors")}: ${safeString(payload.serverErrors)}`);
        if (payload.cause) lines.push(`${t("errors.labels.cause")}: ${payload.cause}`);
        if (payload.stack) lines.push(`${t("errors.labels.stack")}:\n${payload.stack}`);
        return lines.join("\n");
    }, [payload]);

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // ignore (older browsers)
        }
    };

    const descriptionText = isDev
        ? (payload.message || t("errors.serverError"))
        : t("errors.serverError");

    return (
        <StyledRoot>
            <Card>
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
                        <Stack direction="row" alignItems="center" gap={1}>
                            <BugReportIcon />
                            <Typography variant="h5" fontWeight={800}>
                                {t("errors.general")}
                            </Typography>
                        </Stack>

                        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
                            {payload.digest ? <Chip label={`${t("errors.labels.digest")}: ${payload.digest}`} size="small" /> : null}
                            {payload.status ? <Chip label={`${t("errors.labels.status")}: ${payload.status}`} size="small" /> : null}

                            <Tooltip title={t("common.copy")}>
                                <IconButton onClick={() => copy(prettyText)}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title={t("common.refresh")}>
                                <IconButton onClick={() => window.location.reload()}>
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>

                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {descriptionText}
                    </Typography>

                    <Stack direction="row" gap={1} flexWrap="wrap">
                        <Button color="error" variant="contained" onClick={() => reset()}>
                            {t("errors.tryAgain")}
                        </Button>

                        <Button component={Link} href="/" variant="outlined">
                            {t("errors.goHome")}
                        </Button>

                        {isDev && (
                            <Button variant="text" onClick={() => setShowDetails((p) => !p)}>
                                {showDetails ? t("common.close") : t("errors.showDetails")}
                            </Button>
                        )}
                    </Stack>

                    {isDev && (
                        <Collapse in={showDetails}>
                            <Divider sx={{ my: 2 }} />

                            <Stack spacing={1.5}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={700}>
                                        {t("errors.details")}
                                    </Typography>

                                    <Stack direction="row" gap={1}>
                                        <Button size="small" variant="outlined" onClick={() => copy(payload.message || "")}>
                                            {t("errors.copyMessage")}
                                        </Button>
                                        <Button size="small" variant="outlined" onClick={() => copy(payload.stack || "")}>
                                            {t("errors.copyStack")}
                                        </Button>
                                    </Stack>
                                </Box>

                                <Box
                                    component="pre"
                                    sx={{
                                        margin: 0,
                                        padding: 2,
                                        borderRadius: 2,
                                        backgroundColor: "background.default",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        overflow: "auto",
                                        direction: "ltr",
                                        textAlign: "left",
                                        fontSize: 12,
                                        lineHeight: 1.6,
                                        maxHeight: 360,
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {prettyText}
                                </Box>
                            </Stack>
                        </Collapse>
                    )}
                </Stack>
            </Card>
        </StyledRoot>
    );
}

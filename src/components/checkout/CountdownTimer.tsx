import { Box, Typography } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

interface CountdownTimerProps {
    seconds: number;
}

export const CountdownTimer = ({ seconds }: CountdownTimerProps) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const isWarning = seconds < 120;

    const formatTwoDigits = (value: number) =>
        toPersianNumber(value).toString().padStart(2, toPersianNumber(0));

    if (seconds <= 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "error.main",
                }}
            >
                <AccessTime />
                <Typography variant="body2">
                    {t("payment.timeExpired")}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: isWarning ? "warning.main" : "text.secondary",
            }}
        >
            <AccessTime />
            <Typography variant="body2">
                {t("payment.remainingTime", {
                    time: `${formatTwoDigits(minutes)}:${formatTwoDigits(remainingSeconds)}`,
                })}
            </Typography>
        </Box>
    );
};

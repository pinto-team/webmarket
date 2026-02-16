import { Box, Typography } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

interface CountdownTimerProps {
  seconds: number;
}

export const CountdownTimer = ({ seconds }: CountdownTimerProps) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const isWarning = seconds < 120;

  if (seconds <= 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <AccessTime />
        <Typography variant="body2">زمان پرداخت به پایان رسیده است</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: isWarning ? 'warning.main' : 'text.secondary' }}>
      <AccessTime />
      <Typography variant="body2">
        زمان باقیمانده: {minutes.toString().padStart(2, '0')}:{remainingSeconds.toString().padStart(2, '0')}
      </Typography>
    </Box>
  );
};

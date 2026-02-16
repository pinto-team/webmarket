"use client";

import { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface Props {
  min?: number;
  max?: number;
  onChange: (min: number, max: number) => void;
}

export default function PriceRangeFilter({ min, max, onChange }: Props) {
  const [minValue, setMinValue] = useState(min || 0);
  const [maxValue, setMaxValue] = useState(max || 0);

  const handleApply = () => {
    onChange(minValue, maxValue);
  };

  return (
    <Box>
      <Typography variant="subtitle2" mb={2}>محدوده قیمت (تومان)</Typography>
      
      <Box display="flex" gap={1} mb={2}>
        <TextField
          size="small"
          label="از"
          type="number"
          value={minValue}
          onChange={(e) => setMinValue(Number(e.target.value))}
        />
        <TextField
          size="small"
          label="تا"
          type="number"
          value={maxValue}
          onChange={(e) => setMaxValue(Number(e.target.value))}
        />
      </Box>

      <Button 
        variant="outlined" 
        size="small" 
        fullWidth
        onClick={handleApply}
      >
        اعمال
      </Button>
    </Box>
  );
}

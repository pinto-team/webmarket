"use client";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

interface Props {
  value: number;
  onChange: (count: number) => void;
}

const OPTIONS = [20, 40, 60];

export default function ItemsPerPage({ value, onChange }: Props) {
  return (
    <TextField
      select
      size="small"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      sx={{ minWidth: 120 }}
    >
      {OPTIONS.map((option) => (
        <MenuItem key={option} value={option}>
          {option} محصول
        </MenuItem>
      ))}
    </TextField>
  );
}

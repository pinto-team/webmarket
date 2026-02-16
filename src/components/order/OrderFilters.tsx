"use client";

import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface OrderFiltersProps {
  keyword: string;
  status: string;
  onKeywordChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

const ORDER_STATUSES = [
  { value: "", label: "All Orders" },
  { value: "0", label: "Pending" },
  { value: "1", label: "Processing" },
  { value: "2", label: "Failed" },
  { value: "5", label: "Completed" },
  { value: "6", label: "Cancelled" }
];

export default function OrderFilters({ keyword, status, onKeywordChange, onStatusChange, onClear }: OrderFiltersProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
      <TextField
        fullWidth
        placeholder="Search by order code..."
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
        }}
      />
      
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Status</InputLabel>
        <Select value={status} onChange={(e) => onStatusChange(e.target.value)} label="Status">
          {ORDER_STATUSES.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Button
        variant="outlined"
        startIcon={<ClearIcon />}
        onClick={onClear}
        sx={{ minWidth: 100 }}
      >
        Clear
      </Button>
    </Stack>
  );
}

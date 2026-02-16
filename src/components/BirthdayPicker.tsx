"use client";

import { MenuItem, Select, FormControl, FormHelperText } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import FlexBox from "./flex-box/flex-box";

const persianMonths = [
  { value: 1, label: "فروردین" },
  { value: 2, label: "اردیبهشت" },
  { value: 3, label: "خرداد" },
  { value: 4, label: "تیر" },
  { value: 5, label: "مرداد" },
  { value: 6, label: "شهریور" },
  { value: 7, label: "مهر" },
  { value: 8, label: "آبان" },
  { value: 9, label: "آذر" },
  { value: 10, label: "دی" },
  { value: 11, label: "بهمن" },
  { value: 12, label: "اسفند" }
];

const getDaysInMonth = (month: number) => {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return 29;
};

const currentYear = 1403;
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

export default function BirthdayPicker() {
  const { control, watch, setValue } = useFormContext();
  const selectedMonth = watch("birth_month");
  const selectedDay = watch("birth_day");

  const maxDays = getDaysInMonth(selectedMonth || 1);
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  // Adjust day if it exceeds max days for selected month
  if (selectedDay > maxDays) {
    setValue("birth_day", maxDays);
  }

  return (
    <FlexBox gap={1}>
      <Controller
        name="birth_year"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error} size="medium">
            <Select {...field} displayEmpty>
              <MenuItem value="" disabled>سال</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="birth_month"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error} size="medium">
            <Select {...field} displayEmpty>
              <MenuItem value="" disabled>ماه</MenuItem>
              {persianMonths.map((month) => (
                <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="birth_day"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error} size="medium">
            <Select {...field} displayEmpty>
              <MenuItem value="" disabled>روز</MenuItem>
              {days.map((day) => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    </FlexBox>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import { MenuItem, Select, FormControl, FormHelperText } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import FlexBox from "./flex-box/flex-box";
import { toPersianNumber } from "@/utils/persian";
import { t } from "@/i18n/t";

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
    { value: 12, label: "اسفند" },
];

const getDaysInMonth = (month: number) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return 29;
};

const CURRENT_YEAR = 1403;
const YEARS_RANGE = 100;
const years = Array.from({ length: YEARS_RANGE }, (_, i) => CURRENT_YEAR - i);

export default function BirthdayPicker() {
    const { control, watch, setValue } = useFormContext();

    const selectedMonth = watch("birth_month");
    const selectedDay = watch("birth_day");

    const maxDays = useMemo(() => getDaysInMonth(Number(selectedMonth) || 1), [selectedMonth]);
    const days = useMemo(() => Array.from({ length: maxDays }, (_, i) => i + 1), [maxDays]);

    useEffect(() => {
        if (!selectedDay) return;
        const dayNum = Number(selectedDay);
        if (dayNum > maxDays) {
            setValue("birth_day", maxDays, { shouldValidate: true, shouldDirty: true });
        }
    }, [selectedDay, maxDays, setValue]);

    return (
        <FlexBox gap={1} sx={{ flexDirection: "row" }}>
            {/* DAY (comes first in RTL -> right side) */}
            <Controller
                name="birth_day"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error} size="medium">
                        <Select {...field} displayEmpty>
                            <MenuItem value="" disabled>
                                {t("date.day", "روز")}
                            </MenuItem>

                            {days.map((day) => (
                                <MenuItem key={day} value={day}>
                                    {toPersianNumber(day)}
                                </MenuItem>
                            ))}
                        </Select>

                        {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                )}
            />

            {/* MONTH */}
            <Controller
                name="birth_month"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error} size="medium">
                        <Select {...field} displayEmpty>
                            <MenuItem value="" disabled>
                                {t("date.month", "ماه")}
                            </MenuItem>

                            {persianMonths.map((month) => (
                                <MenuItem key={month.value} value={month.value}>
                                    {month.label}
                                </MenuItem>
                            ))}
                        </Select>

                        {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                )}
            />

            {/* YEAR */}
            <Controller
                name="birth_year"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error} size="medium">
                        <Select {...field} displayEmpty>
                            <MenuItem value="" disabled>
                                {t("date.year", "سال")}
                            </MenuItem>

                            {years.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {toPersianNumber(year)}
                                </MenuItem>
                            ))}
                        </Select>

                        {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                )}
            />
        </FlexBox>
    );
}

"use client";

import { useEffect, useMemo } from "react";
import { MenuItem, Select, FormControl, FormHelperText } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import FlexBox from "./flex-box/flex-box";
import { toPersianNumber, getCurrentJalaliYear } from "@/utils/persian";
import { t } from "@/i18n/t";

const getDaysInMonth = (month: number) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return 29;
};

const YEARS_RANGE = 100;

const JALALI_MONTH_KEYS = [
    "date.jalaliMonths.1",
    "date.jalaliMonths.2",
    "date.jalaliMonths.3",
    "date.jalaliMonths.4",
    "date.jalaliMonths.5",
    "date.jalaliMonths.6",
    "date.jalaliMonths.7",
    "date.jalaliMonths.8",
    "date.jalaliMonths.9",
    "date.jalaliMonths.10",
    "date.jalaliMonths.11",
    "date.jalaliMonths.12",
] as const;

export default function BirthdayPicker() {
    const { control, watch, setValue } = useFormContext();

    const selectedMonth = watch("birth_month");
    const selectedDay = watch("birth_day");

    const currentYear = getCurrentJalaliYear();
    const years = useMemo(
        () => Array.from({ length: YEARS_RANGE }, (_, i) => currentYear - i),
        [currentYear]
    );

    const maxDays = useMemo(
        () => getDaysInMonth(Number(selectedMonth) || 1),
        [selectedMonth]
    );
    const days = useMemo(
        () => Array.from({ length: maxDays }, (_, i) => i + 1),
        [maxDays]
    );

    useEffect(() => {
        if (!selectedDay) return;
        const dayNum = Number(selectedDay);
        if (dayNum > maxDays) {
            setValue("birth_day", maxDays, { shouldValidate: true, shouldDirty: true });
        }
    }, [selectedDay, maxDays, setValue]);

    return (
        <FlexBox gap={1} sx={{ flexDirection: "row" }}>
            {/* DAY */}
            <Controller
                name="birth_day"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error} size="medium">
                        <Select {...field} displayEmpty>
                            <MenuItem value="" disabled>
                                {t("date.day")}
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
                                {t("date.month")}
                            </MenuItem>

                            {JALALI_MONTH_KEYS.map((monthKey, index) => (
                                <MenuItem key={monthKey} value={index + 1}>
                                    {t(monthKey)}
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
                                {t("date.year")}
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

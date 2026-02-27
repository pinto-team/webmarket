"use client";

import * as React from "react";
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

type RHFTextFieldProps = Omit<MuiTextFieldProps, "name"> & {
    name: string;
};

export default function TextField({ name, helperText, ...other }: RHFTextFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const errorText = fieldState.error?.message;

                return (
                    <MuiTextField
                        {...other}
                        // ✅ اولویت: props.value (برای نمایش سفارشی مثل فارسی)
                        value={other.value ?? field.value ?? ""}
                        onChange={(e) => {
                            // اگر خود صفحه onChange داده بود، همون اجرا بشه
                            if (other.onChange) other.onChange(e as any);
                            else field.onChange(e);
                        }}
                        onBlur={(e) => {
                            if (other.onBlur) other.onBlur(e as any);
                            field.onBlur();
                        }}
                        inputRef={field.ref}
                        error={!!errorText || other.error}
                        helperText={errorText ?? helperText}
                    />
                );
            }}
        />
    );
}
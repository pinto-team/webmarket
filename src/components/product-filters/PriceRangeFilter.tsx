"use client";

import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { t } from "@/i18n/t";

interface Props {
    min?: number;
    max?: number;
    onChange: (min: number, max: number) => void;
}

export default function PriceRangeFilter({ min, max, onChange }: Props) {
    const [minValue, setMinValue] = useState<number | "">("");
    const [maxValue, setMaxValue] = useState<number | "">("");

    useEffect(() => {
        setMinValue(min ?? "");
        setMaxValue(max ?? "");
    }, [min, max]);

    const handleApply = () => {
        onChange(Number(minValue) || 0, Number(maxValue) || 0);
    };

    return (
        <Box>
            <Typography variant="subtitle2" mb={2}>
                {t("products.priceRangeTitle")}
            </Typography>

            <Box display="flex" gap={1} mb={2}>
                <TextField
                    size="small"
                    label={t("products.priceFrom")}
                    type="number"
                    value={minValue}
                    onChange={(e) =>
                        setMinValue(e.target.value === "" ? "" : Number(e.target.value))
                    }
                />

                <TextField
                    size="small"
                    label={t("products.priceTo")}
                    type="number"
                    value={maxValue}
                    onChange={(e) =>
                        setMaxValue(e.target.value === "" ? "" : Number(e.target.value))
                    }
                />
            </Box>

            <Button variant="outlined" size="small" fullWidth onClick={handleApply}>
                {t("common.apply")}
            </Button>
        </Box>
    );
}

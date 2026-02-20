"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
// MUI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// STYLED COMPONENT
import { SearchOutlinedIcon } from "./styles";
import { t } from "@/i18n/t";

function getCurrentParams(): URLSearchParams {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
}

export function SearchInput2() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const handleSearch = useCallback(() => {
        const q = search.trim();
        if (!q) return;

        const params = getCurrentParams();
        params.set("q", q);

        router.push(`/products/search?${params.toString()}`);
        setSearch("");
    }, [router, search]);

    const INPUT_PROPS = useMemo(
        () => ({
            sx: {
                border: 0,
                height: 44,
                paddingRight: 0,
                overflow: "hidden",
                backgroundColor: "grey.50",
                "& .MuiOutlinedInput-notchedOutline": { border: 0 },
            },
            endAdornment: (
                <Button
                    color="primary"
                    disableElevation
                    variant="contained"
                    onClick={handleSearch}
                    sx={{ px: "3rem", height: "100%", borderRadius: "0 4px 4px 0" }}
                >
                    {t("search.submit")}
                </Button>
            ),
            startAdornment: <SearchOutlinedIcon fontSize="small" />,
        }),
        [handleSearch]
    );

    return (
        <Box position="relative" flex="1 1 0" maxWidth={670} mx="auto">
            <TextField
                fullWidth
                value={search}
                variant="outlined"
                placeholder={t("search.placeholder")}
                aria-label={t("search.ariaLabel")}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{ input: INPUT_PROPS }}
            />
        </Box>
    );
}
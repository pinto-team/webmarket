"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Search from "icons/Search";

import { searchService } from "@/services/search.service";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import type { SearchSuggestion } from "@/types/search.types";
import { t } from "@/i18n/t";

interface Props {
    placeholder?: string;
    size?: "small" | "medium";
}

export default function UniversalSearchBar({ placeholder, size = "medium" }: Props) {
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const { recentSearches, addSearch } = useSearchHistory();
    const router = useRouter();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const effectivePlaceholder = placeholder || t("search.placeholderUniversal");

    const goProductSearch = useCallback(
        (q: string) => {
            router.push(`/products/search?q=${encodeURIComponent(q)}`);
        },
        [router]
    );

    // recent suggestions (when query < 2)
    const recentSuggestions: SearchSuggestion[] = useMemo(() => {
        return recentSearches.map((text) => ({ text, type: "recent" as const }));
    }, [recentSearches]);

    const displaySuggestions: SearchSuggestion[] = useMemo(() => {
        const q = query.trim();
        if (q.length >= 2) return suggestions;
        if (q.length < 2) return recentSuggestions;
        return [];
    }, [query, suggestions, recentSuggestions]);

    const closeSuggestions = useCallback(() => {
        setShowSuggestions(false);
        setActiveIndex(-1);
    }, []);

    const openSuggestions = useCallback(() => {
        setShowSuggestions(true);
    }, []);

    const handleSearch = useCallback(
        (searchQuery: string) => {
            const q = searchQuery.trim();
            if (!q) return;

            addSearch(q);
            setQuery("");
            closeSuggestions();

            goProductSearch(q);
        },
        [addSearch, closeSuggestions, goProductSearch]
    );

    const handleSuggestionClick = useCallback(
        (suggestion: SearchSuggestion) => {
            addSearch(suggestion.text);
            setQuery("");
            closeSuggestions();

            switch (suggestion.type) {
                case "product": {
                    // ✅ MUST use product code/slug, NOT title
                    if (suggestion.code) {
                        router.push(`/products/${encodeURIComponent(suggestion.code)}`);
                    } else {
                        goProductSearch(suggestion.text);
                    }
                    break;
                }

                case "category": {
                    if (suggestion.code) {
                        // ⚠️ اگر پروژه‌ت با categories[] کار می‌کنه، این رو عوض کن
                        router.push(`/products?category=${encodeURIComponent(suggestion.code)}`);
                    } else {
                        goProductSearch(suggestion.text);
                    }
                    break;
                }

                case "brand": {
                    if (suggestion.code) {
                        router.push(`/products?brand=${encodeURIComponent(suggestion.code)}`);
                    } else {
                        goProductSearch(suggestion.text);
                    }
                    break;
                }

                case "recent":
                default:
                    goProductSearch(suggestion.text);
                    break;
            }
        },
        [addSearch, closeSuggestions, goProductSearch, router]
    );

    // Debounced suggestions fetch
    useEffect(() => {
        const q = query.trim();

        // reset selection on input change
        setActiveIndex(-1);

        // if short query => clear fetched suggestions
        if (q.length < 2) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        // debounce
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            // cancel previous
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setLoading(true);

            try {
                const results = await searchService.getSearchSuggestions(q, controller.signal);
                if (controller.signal.aborted) return;

                setSuggestions(results);
                setShowSuggestions(true);
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error(t("search.suggestionsFetchError"), err);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }, 300);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            abortRef.current?.abort();
        };
    }, [query]);

    // Close on outside click
    useEffect(() => {
        if (!showSuggestions) return;

        const onDown = (e: MouseEvent | TouchEvent) => {
            const root = rootRef.current;
            if (!root) return;
            if (root.contains(e.target as Node)) return;
            closeSuggestions();
        };

        document.addEventListener("mousedown", onDown);
        document.addEventListener("touchstart", onDown);

        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("touchstart", onDown);
        };
    }, [showSuggestions, closeSuggestions]);

    const chipLabel = (type: SearchSuggestion["type"]) =>
        type === "recent"
            ? t("search.types.recent")
            : type === "product"
                ? t("search.types.product")
                : type === "category"
                    ? t("search.types.category")
                    : t("search.types.brand");

    const onKeyDown = (e: React.KeyboardEvent) => {
        const items = displaySuggestions;

        if (e.key === "Escape") {
            closeSuggestions();
            return;
        }

        if (e.key === "Enter") {
            // If suggestions open and one is selected => choose it
            if (showSuggestions && activeIndex >= 0 && activeIndex < items.length) {
                e.preventDefault();
                handleSuggestionClick(items[activeIndex]);
                return;
            }

            // Otherwise normal search
            e.preventDefault();
            handleSearch(query);
            return;
        }

        if (!showSuggestions) return;
        if (!items.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => {
                const next = prev + 1;
                return next >= items.length ? 0 : next;
            });
            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => {
                const next = prev - 1;
                return next < 0 ? items.length - 1 : next;
            });
            return;
        }
    };

    const CONTROL_HEIGHT = 48;

    const INPUT_PROPS = {
        inputRef,
        sx: {
            height: CONTROL_HEIGHT,
            backgroundColor: "grey.50",
            borderRadius: 1,

            // ✅ force the outlined input to the same height as button
            "&.MuiInputBase-root, & .MuiOutlinedInput-root": {
                height: CONTROL_HEIGHT,
                padding: 0,
            },

            "& .MuiOutlinedInput-input": {
                height: CONTROL_HEIGHT,
                boxSizing: "border-box",
                px: 4,
            },

            "& .MuiOutlinedInput-notchedOutline": {
                border: 1,
                borderRadius: 1,
                borderColor: "transparent", // ✅ مثل قبل
            },
        },

        endAdornment: (
            <Box
                ml={2}
                px={2}
                display="grid"
                alignItems="center"
                justifyContent="center"
                borderLeft="1px solid"
                borderColor="grey.200"
                sx={{ cursor: "pointer", height: 28 }} // ✅ same height
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSearch(query)}
            >
                <Search sx={{ fontSize: 17, color: "grey.400" }} />
            </Box>
        ),
    };

    return (
        <Box ref={rootRef} position="relative">
            <TextField
                fullWidth
                value={query}
                variant="outlined"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={openSuggestions}
                placeholder={effectivePlaceholder}
                slotProps={{ input: INPUT_PROPS }}
                aria-label={t("search.ariaLabel")}
                role="searchbox"
                size={size}
            />

            {showSuggestions && (displaySuggestions.length > 0 || loading) && (
                <Paper
                    sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        mt: 1,
                        zIndex: 1000,
                        maxHeight: 300,
                        overflow: "auto",
                    }}
                >
                    <List dense>
                        {displaySuggestions.map((suggestion, i) => (
                            <ListItemButton
                                key={`${suggestion.type}-${suggestion.code ?? suggestion.text}-${i}`}
                                selected={i === activeIndex}
                                onMouseDown={(e) => e.preventDefault()} // ✅ prevent blur before click
                                onMouseEnter={() => setActiveIndex(i)}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                <ListItemText
                                    primary={suggestion.text}
                                    secondary={
                                        <Chip
                                            component="span"
                                            label={chipLabel(suggestion.type)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    }
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}
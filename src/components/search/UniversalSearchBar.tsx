"use client";

import { useState, useEffect, useRef } from "react";
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
import { SearchSuggestion } from "@/types/search.types";

interface Props {
  placeholder?: string;
  size?: "small" | "medium";
}

export default function UniversalSearchBar({ placeholder = "جستجو در محصولات و مقالات...", size = "medium" }: Props) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { recentSearches, addSearch } = useSearchHistory();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (query.length >= 2) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await searchService.getSearchSuggestions(query);
          console.log('Search suggestions:', results);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Failed to get suggestions:", error);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  const handleSearch = (searchQuery: string, type: 'product' | 'post' = 'product') => {
    if (!searchQuery.trim()) return;

    addSearch(searchQuery);
    setQuery("");
    setShowSuggestions(false);
    
    if (type === 'post') {
      router.push(`/blog/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/products/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const searchType = suggestion.type === 'product' ? 'product' : 'product';
    handleSearch(suggestion.text, searchType);
  };

  const displaySuggestions = query.length >= 2 && suggestions.length > 0 ? suggestions : 
    (query.length < 2 && recentSearches.length > 0 ? recentSearches.map(search => ({ text: search, type: 'recent' as const })) : []);

  const INPUT_PROPS = {
    sx: {
      border: 0,
      padding: 0,
      borderRadius: 1,
      borderColor: "transparent",
      overflow: "hidden",
      backgroundColor: "grey.50",
      "& .MuiOutlinedInput-notchedOutline": {
        border: 1,
        borderRadius: 1,
        borderColor: "transparent"
      }
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
        sx={{ cursor: "pointer" }}
        onClick={() => handleSearch(query)}>
        <Search sx={{ fontSize: 17, color: "grey.400" }} />
      </Box>
    )
  };

  return (
    <Box position="relative">
      <TextField
        fullWidth
        value={query}
        variant="outlined"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        slotProps={{ input: INPUT_PROPS }}
        aria-label="جستجوی محصولات"
        role="searchbox"
      />

      {showSuggestions && (displaySuggestions.length > 0 || loading) && (
        <Paper sx={{ position: "absolute", top: "100%", left: 0, right: 0, mt: 1, zIndex: 1000, maxHeight: 300, overflow: "auto" }}>
          <List dense>
            {displaySuggestions.map((suggestion, i) => (
              <ListItemButton key={i} onClick={() => handleSuggestionClick(suggestion)}>
                <ListItemText 
                  primary={suggestion.text}
                  secondary={
                    <Chip 
                      component="span" 
                      label={suggestion.type === 'recent' ? 'اخیر' : suggestion.type === 'product' ? 'محصول' : suggestion.type === 'category' ? 'دسته‌بندی' : 'برند'} 
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
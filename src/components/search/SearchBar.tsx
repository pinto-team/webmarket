"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

interface Props {
  initialValue?: string;
}

export default function SearchBar({ initialValue = "" }: Props) {
  const [query, setQuery] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const recent = localStorage.getItem("recentSearches");
    if (recent) setRecentSearches(JSON.parse(recent));
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setShowSuggestions(false);
    router.push(`/products/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Box position="relative">
      <TextField
        fullWidth
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSearch(query)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="جستجوی محصولات..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton size="small" onClick={() => handleSearch(query)}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setQuery("")}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {showSuggestions && recentSearches.length > 0 && (
        <Paper sx={{ position: "absolute", top: "100%", left: 0, right: 0, mt: 1, zIndex: 1000 }}>
          <List dense>
            {recentSearches.map((search, i) => (
              <ListItemButton key={i} onClick={() => handleSearch(search)}>
                <ListItemText primary={search} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

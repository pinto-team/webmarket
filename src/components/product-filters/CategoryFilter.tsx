"use client";

import { useState } from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { CategoryResource } from "@/types/product.types";

interface Props {
  categories: CategoryResource[];
  selected?: string;
  onChange: (categoryCode: string) => void;
}

export default function CategoryFilter({ categories, selected, onChange }: Props) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const toggleExpand = (code: string) => {
    setExpanded(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const filterCategories = (cats: CategoryResource[]): CategoryResource[] => {
    if (!search) return cats;
    return cats.filter(cat => {
      const title = cat.title || cat.name;
      const matches = title.toLowerCase().includes(search.toLowerCase());
      const childMatches = cat.children ? filterCategories(cat.children).length > 0 : false;
      return matches || childMatches;
    });
  };

  const renderCategory = (category: CategoryResource, level = 0) => {
    const displayTitle = category.title || category.name;
    const categoryCode = category.code || category.slug;
    
    return (
      <div key={`${categoryCode}-${category.id}`}>
        <ListItemButton
          sx={{ pl: 2 + level * 2 }}
          selected={selected === categoryCode}
          onClick={() => onChange(categoryCode)}
        >
          <ListItemText primary={displayTitle} />
          {category.children && category.children.length > 0 && (
            <div onClick={(e) => { e.stopPropagation(); toggleExpand(categoryCode); }}>
              {expanded.includes(categoryCode) ? <ExpandLess /> : <ExpandMore />}
            </div>
          )}
        </ListItemButton>
        {category.children && category.children.length > 0 && (
          <Collapse in={expanded.includes(categoryCode)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.children.map(child => <div key={`${child.code || child.slug}-${child.id}`}>{renderCategory(child, level + 1)}</div>)}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

  const filteredCategories = filterCategories(categories);

  return (
    <div>
      <Typography variant="subtitle2" mb={2}>دسته بندی</Typography>
      <TextField
        size="small"
        fullWidth
        placeholder="جستجو..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      {!categories || categories.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>دسته بندی موجود نیست</Typography>
      ) : (
        <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
          <List dense>
            {filteredCategories.map(category => renderCategory(category))}
          </List>
        </Box>
      )}
    </div>
  );
}

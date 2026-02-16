"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { PostCategoryResource } from "@/types/content.types";
import { contentService } from "@/services/content.service";

export default function BlogCategoryNav() {
  const [categories, setCategories] = useState<PostCategoryResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await contentService.getPostCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <CircularProgress size={24} />;
  if (!categories.length) return null;

  return (
    <div>
      <Typography variant="h6" className="mb-2">دسته بندی‌ها</Typography>
      <List>
        {categories.map((cat) => (
          <ListItem key={cat.slug} disablePadding>
            <ListItemButton component={Link} href={`/blog/category/${cat.slug}`}>
              <ListItemText primary={cat.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

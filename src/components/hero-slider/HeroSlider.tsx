"use client";

import { useState } from "react";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { HeroSlide } from "@/types/shopData.types";
import HeroSliderSkeleton from "@/components/skeletons/HeroSliderSkeleton";

interface HeroSliderProps {
  slides: HeroSlide[];
  loading?: boolean;
}

export default function HeroSlider({ slides, loading }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (loading) return <HeroSliderSkeleton />;
  if (!slides || slides.length === 0) return null;

  const slide = slides[currentSlide];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <Box
      sx={{
        position: "relative",
        height: 550,
        backgroundColor: slide.background_color,
        color: slide.text_color,
        backgroundImage: `url(${slide.image_desktop.main_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 4,
        borderRadius: 2,
        overflow: "hidden"
      }}
    >
      <Container>
        <Box maxWidth={600} textAlign="center">
          <Typography variant="h6" mb={1}>{slide.subtitle}</Typography>
          <Typography variant="h2" fontWeight={700} mb={2}>{slide.title}</Typography>
          <Typography variant="body1" mb={3}>{slide.description}</Typography>
          <Button variant="contained" color={"dark"} size="large" href={slide.button_link}>
            {slide.button_text}
          </Button>
        </Box>
      </Container>

      {slides.length > 1 && (
        <>
          <IconButton
            onClick={prevSlide}
            sx={{ position: "absolute", left: 16, color: slide.text_color }}
          >
            <ChevronRight />
          </IconButton>
          <IconButton
            onClick={nextSlide}
            sx={{ position: "absolute", right: 16, color: slide.text_color }}
          >
            <ChevronLeft />
          </IconButton>
        </>
      )}
    </Box>
  );
}

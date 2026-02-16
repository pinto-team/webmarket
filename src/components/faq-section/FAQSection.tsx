"use client";

import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Container, Skeleton, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { FAQ } from "@/types/shopData.types";

interface FAQSectionProps {
  faqs: FAQ[];
  loading?: boolean;
}

export default function FAQSection({ faqs, loading }: FAQSectionProps) {
  const [expanded, setExpanded] = useState<number | false>(false);

  if (loading) {
    return (
      <Container sx={{ my: 6 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 2 }} />
        ))}
      </Container>
    );
  }

  if (!faqs || faqs.length === 0) return null;

  return (
    <Container sx={{ my: 6 }}>
      <Typography variant="h3" mb={3}>سوالات متداول</Typography>
      {faqs.map((faq, index) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={() => setExpanded(expanded === index ? false : index)}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}

"use client";

import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Container, Skeleton, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import type { FAQ } from "@/types/shopData.types";
import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

interface FAQSectionProps {
    faqs: FAQ[];
    loading?: boolean;
}

const FAQ_SKELETON_COUNT = 3;

export default function FAQSection({ faqs, loading }: FAQSectionProps) {
    const [expanded, setExpanded] = useState<number | false>(false);

    if (loading) {
        return (
            <Container sx={{ my: 6 }}>
                <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
                {Array.from({ length: FAQ_SKELETON_COUNT }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 2 }} />
                ))}
            </Container>
        );
    }

    if (!faqs?.length) return null;

    return (
        <Container sx={{ my: 6 }}>
            <Typography variant="h3" mb={3}>
                {t("nav.faq")}
            </Typography>

            {faqs.map((faq, index) => (
                <Accordion
                    key={index}
                    expanded={expanded === index}
                    onChange={() => setExpanded(expanded === index ? false : index)}
                >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight={600}>{toPersianNumber(faq.question)}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <div dangerouslySetInnerHTML={{ __html: toPersianNumber(faq.answer) }} />
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
}

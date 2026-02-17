"use client";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { t } from "@/i18n/t";

interface Props {
    description?: string;
}

export default function ProductDescription({ description }: Props) {
    return (
        <div>
            <Typography variant="h3" sx={{ mb: 2 }}>
                {t("products.description")}
            </Typography>

            {!description ? (
                <Typography variant="body1">
                    {t("productDetail.noDescription")}
                </Typography>
            ) : (
                <Box
                    sx={{
                        "& ul": { pr: 3, mb: 2 },
                        "& ol": { pr: 3, mb: 2 },
                        "& li": { mb: 1 },
                        "& p": { mb: 2 },
                        "& h1, & h2, & h3, & h4, & h5, & h6": { mt: 2, mb: 1 },
                    }}
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            )}
        </div>
    );
}

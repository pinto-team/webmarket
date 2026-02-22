"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

type Props = {
    text: string;
};

export default function FooterCopyrightBar({ text }: Props) {
    return (
        <Box component="footer" bgcolor="grey.900" color="grey.400">
            <Divider sx={{ borderColor: "grey.800" }} />
            <Typography
                variant="body2"
                sx={{
                    py: 1.25,
                    textAlign: "center",
                    lineHeight: 1.6,
                }}
            >
                {text}
            </Typography>
        </Box>
    );
}
"use client";

import { type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function LoginModalPage({ children }: PropsWithChildren) {
    const router = useRouter();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

    return (
        <Dialog
            open
            scroll="body"
            fullWidth={isMobile}
            onClose={() => router.back()}
            sx={{ zIndex: 9999 }}
        >
            {children}
        </Dialog>
    );
}

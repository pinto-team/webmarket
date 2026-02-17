"use client";

import { t } from "@/i18n/t";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function AddToCartDialog({ open, onClose }: Props) {
    const router = useRouter();

    const handleGoToCart = () => {
        onClose();
        router.push("/cart");
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">
                        {t("messages.addedToCart")}
                    </Typography>
                </Box>

                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2, pb: 3 }} />

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={handleGoToCart}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ borderRadius: 2 }}
                >
                    {t("cart.viewCart")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

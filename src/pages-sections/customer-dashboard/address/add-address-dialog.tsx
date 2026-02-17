"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import AddressForm from "@/components/address/address-form";
import { t } from "@/i18n/t";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddAddressDialog({ open, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);

    const handleSuccess = () => {
        onSuccess();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t("addresses.addNew")}</DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <AddressForm onSuccess={handleSuccess} onCancel={onClose} showActions={false} />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    {t("common.cancel")}
                </Button>

                <Button type="submit" form="address-form" variant="contained" disabled={loading}>
                    {loading ? t("common.loading") : t("common.save")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

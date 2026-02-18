"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import AddressForm from "@/components/address/address-form";
import { AddressResource } from "@/types/address.types";
import { t } from "@/i18n/t";

interface Props {
    open: boolean;
    address: AddressResource | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditAddressDialog({ open, address, onClose, onSuccess }: Props) {
    const handleSuccess = () => {
        onSuccess();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t("addresses.edit")}</DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {address && (
                    <AddressForm
                        address={address}
                        onSuccess={handleSuccess}
                        onCancel={onClose}
                        showActions
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

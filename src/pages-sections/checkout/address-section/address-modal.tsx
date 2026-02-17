"use client";

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import { AddressResource } from "@/types/address.types";
import { addressService } from "@/services/address.service";
import { useSnackbar } from "notistack";

import AddressList from "./address-list";
import AddressForm from "./address-form";

import { t } from "@/i18n/t";

interface AddressModalProps {
    open: boolean;
    onClose: () => void;
    addresses: AddressResource[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    onRefresh: () => void;
}

export default function AddressModal({
                                         open,
                                         onClose,
                                         addresses,
                                         selectedId,
                                         onSelect,
                                         onRefresh,
                                     }: AddressModalProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressResource | undefined>();

    const handleEdit = (address: AddressResource) => {
        setEditingAddress(address);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await addressService.deleteAddress(id);
            enqueueSnackbar(t("addresses.deletedSuccess"), { variant: "success" });
            onRefresh();
        } catch (error: any) {
            enqueueSnackbar(
                error?.response?.data?.message || t("addresses.deleteFailed"),
                { variant: "error" }
            );
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingAddress(undefined);
        onRefresh();
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingAddress(undefined);
    };

    const handleAddNew = () => {
        setEditingAddress(undefined);
        setShowForm(true);
    };

    const modalTitle = showForm
        ? editingAddress
            ? t("addresses.edit")
            : t("addresses.addNew")
        : t("addresses.selectAddress");

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    {modalTitle}
                    <IconButton onClick={onClose} size="small" aria-label={t("common.close")}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {showForm ? (
                    <AddressForm
                        address={editingAddress}
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                ) : (
                    <>
                        <AddressList
                            addresses={addresses}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddNew}
                            sx={{ mt: 2 }}
                        >
                            {t("addresses.addNew")}
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

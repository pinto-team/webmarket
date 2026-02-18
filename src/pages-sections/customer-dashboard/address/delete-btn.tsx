"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Trash from "icons/Trash";

import { addressService } from "@/services/address.service";
import { t } from "@/i18n/t";

interface Props {
    id: number;
    onDelete: () => void;
}

export default function DeleteAddressBtn({ id, onDelete }: Props) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm(t("addresses.deleteConfirm"));

        if (!confirmed) return;

        setLoading(true);
        try {
            await addressService.deleteAddress(id);
            onDelete();
        } catch {
            // intentional silent fail (toast should be handled globally)
        } finally {
            setLoading(false);
        }
    };

    return (
        <IconButton onClick={handleDelete} disabled={loading}>
            <Trash fontSize="small" color="error" />
        </IconButton>
    );
}

"use client";

import { Card, Box, Typography, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import { AddressResource } from "@/types/address.types";
import { t } from "@/i18n/t";

interface AddressDisplayProps {
    address: AddressResource | null;
    onEdit: () => void;
}

export default function AddressDisplay({ address, onEdit }: AddressDisplayProps) {
    const comma = t("common.comma");
    const pipe = t("common.pipe");

    if (!address) {
        return (
            <Card sx={{ p: 3, mb: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography color="text.secondary">
                        {t("checkout.selectAddressWarning")}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={onEdit}
                        startIcon={<LocationOnIcon />}
                    >
                        {t("addresses.selectAddress")}
                    </Button>
                </Box>
            </Card>
        );
    }

    const floorPart = address.floor
        ? `${comma} ${t("addresses.form.floor")} ${address.floor}`
        : "";

    const unitPart = address.room
        ? `${comma} ${t("addresses.form.unit")} ${address.room}`
        : "";

    const fullAddress = `${address.region.title}${comma} ${address.district}${comma} ${address.street}${floorPart}${unitPart}`;

    return (
        <Card sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="flex-start" gap={2}>
                <LocationOnIcon color="primary" sx={{ mt: 0.5 }} />
                <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                        {address.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={1}>
                        {fullAddress}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {t("addresses.postalCode")}: {address.postal}{" "}
                        {pipe}{" "}
                        {t("addresses.phone")}: {address.mobile}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={onEdit}
                    startIcon={<EditIcon />}
                >
                    {t("addresses.edit")}
                </Button>
            </Box>
        </Card>
    );
}

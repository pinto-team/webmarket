"use client";

import { Card, Box, Typography, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import type { AddressResource } from "@/types/address.types";
import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

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
                    <Typography color="text.secondary">{t("checkout.selectAddressWarning")}</Typography>

                    <Button variant="contained" onClick={onEdit} startIcon={<LocationOnIcon />}>
                        {t("addresses.selectAddress")}
                    </Button>
                </Box>
            </Card>
        );
    }

    const floorPart =
        address.floor != null
            ? `${comma} ${t("addresses.form.floor")} ${address.floor}`
            : "";

    const unitPart =
        address.room != null
            ? `${comma} ${t("addresses.form.unit")} ${address.room}`
            : "";

    const fullAddressRaw =
        `${address.region.title}${comma} ${address.district}${comma} ${address.street}` +
        `${floorPart}${unitPart}`;

    const titleFa = address.title ? toPersianNumber(address.title) : "";
    const fullAddressFa = toPersianNumber(fullAddressRaw);

    const postalFa = address.postal ? toPersianNumber(address.postal) : "";
    const mobileFa = address.mobile ? toPersianNumber(address.mobile) : "";

    return (
        <Card sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="flex-start" gap={2}>
                <LocationOnIcon color="primary" sx={{ mt: 0.5 }} />

                <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                        {titleFa}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={1}>
                        {fullAddressFa}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {t("addresses.postalCode")}: {postalFa} {pipe} {t("addresses.phone")}: {mobileFa}
                    </Typography>
                </Box>

                <Button variant="outlined" size="small" onClick={onEdit} startIcon={<EditIcon />}>
                    {t("addresses.edit")}
                </Button>
            </Box>
        </Card>
    );
}
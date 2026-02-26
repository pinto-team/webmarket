"use client";

import { Box, Radio, Typography, IconButton, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { AddressResource } from "@/types/address.types";
import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

interface AddressListProps {
    addresses: AddressResource[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    onEdit: (address: AddressResource) => void;
    onDelete: (id: number) => void;
}

export default function AddressList({
                                        addresses,
                                        selectedId,
                                        onSelect,
                                        onEdit,
                                        onDelete,
                                    }: AddressListProps) {
    return (
        <Box>
            {addresses.map((address, index) => {
                const fullAddress = [
                    address.region?.title,
                    address.district,
                    address.street,
                ]
                    .filter(Boolean)
                    .join(t("common.comma"));

                return (
                    <Box key={address.id}>
                        <Box display="flex" alignItems="flex-start" gap={1} py={2}>
                            <Radio
                                checked={selectedId === address.id}
                                onChange={() => onSelect(address.id)}
                                sx={{ mt: -0.5 }}
                            />

                            <Box
                                flex={1}
                                onClick={() => onSelect(address.id)}
                                sx={{ cursor: "pointer" }}
                            >
                                <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                                    {toPersianNumber(address.title)}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" mb={0.5}>
                                    {toPersianNumber(fullAddress)}
                                </Typography>

                                <Typography variant="caption" color="text.secondary">
                                    {address.mobile ? toPersianNumber(address.mobile) : "-"}
                                </Typography>
                            </Box>

                            <Box display="flex" gap={0.5}>
                                <IconButton size="small" onClick={() => onEdit(address)}>
                                    <EditIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => onDelete(address.id)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>

                        {index < addresses.length - 1 && <Divider />}
                    </Box>
                );
            })}
        </Box>
    );
}
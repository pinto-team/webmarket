import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";

import DeleteAddressBtn from "./delete-btn";
import { toPersianNumber } from "@/utils/persian";
import { AddressResource } from "@/types/address.types";
import { t } from "@/i18n/t";

const StyledTableRow = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "200px 150px 1fr 120px 80px",
    gap: "1rem",
    alignItems: "center",
    padding: "1rem 1.5rem",
    marginBottom: "0.75rem",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "8px",
    [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr",
        gap: "0.5rem",
    },
}));

type Props = {
    address: AddressResource;
    onUpdate: () => void;
    onEdit: (address: AddressResource) => void;
};

const normalizeText = (v?: string | null) => {
    const s = (v ?? "").trim();
    if (!s) return null;
    if (s.toLowerCase() === "null") return null;
    return s;
};

export default function AddressListItem({ address, onUpdate, onEdit }: Props) {
    const addressParts = [
        normalizeText(address.region?.title),
        normalizeText(address.district),
        normalizeText(address.street),
    ].filter(Boolean) as string[];

    const fullAddress = addressParts.join(t("addresses.separator"));

    const mobileFa = address.mobile ? toPersianNumber(address.mobile) : "-";
    const postalFa = address.postal ? toPersianNumber(address.postal) : "-";

    return (
        <StyledTableRow>
            <Box>
                <Typography fontWeight={500} variant="body1" mb={0.5}>
                    {t("addresses.fields.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {toPersianNumber(address.title)}
                </Typography>
            </Box>

            <Box>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                    {t("addresses.fields.mobile")}
                </Typography>
                <Typography variant="body1">{mobileFa}</Typography>
            </Box>

            <Box>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                    {t("addresses.fields.address")}
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                    {toPersianNumber(fullAddress || "-")}
                </Typography>
            </Box>

            <Box>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                    {t("addresses.fields.postal")}
                </Typography>
                <Typography variant="body1">{postalFa}</Typography>
            </Box>

            <Box display="flex" gap={1} justifyContent="flex-end">
                <IconButton onClick={() => onEdit(address)} size="small" color="primary">
                    <EditIcon fontSize="small" />
                </IconButton>
                <DeleteAddressBtn id={address.id} onDelete={onUpdate} />
            </Box>
        </StyledTableRow>
    );
}
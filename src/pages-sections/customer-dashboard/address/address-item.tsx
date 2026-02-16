import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import DeleteAddressBtn from "./delete-btn";
import { toPersianNumber } from "@/utils/persian";
import { AddressResource } from "@/types/address.types";

const StyledTableRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '200px 150px 1fr 120px 80px', // title, mobile, address, postal, actions
  gap: '1rem',
  alignItems: 'center',
  padding: '1rem 1.5rem',
  marginBottom: '0.75rem',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr', // Stack on mobile
    gap: '0.5rem'
  }
}));

type Props = { 
  address: AddressResource;
  onUpdate: () => void;
  onEdit: (address: AddressResource) => void;
};

export default function AddressListItem({ address, onUpdate, onEdit }: Props) {
  // Build address string, excluding null/empty district
  const addressParts = [
    address.region?.title,
    address.district && address.district !== 'null' ? address.district : null,
    address.street
  ].filter(Boolean);
  
  const fullAddress = addressParts.join(' - ');
  
  return (
    <StyledTableRow>
      <Box>
        <Typography fontWeight={500} variant="body1" mb={0.5}>
          عنوان
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {address.title}
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          موبایل
        </Typography>
        <Typography variant="body1">
          {toPersianNumber(address.mobile)}
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          آدرس
        </Typography>
        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
          {fullAddress}
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          کد پستی
        </Typography>
        <Typography variant="body1">
          {toPersianNumber(address.postal)}
        </Typography>
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

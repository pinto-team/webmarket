"use client";

import { Card, Box, Typography, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import { AddressResource } from "@/types/address.types";

interface AddressDisplayProps {
  address: AddressResource | null;
  onEdit: () => void;
}

export default function AddressDisplay({ address, onEdit }: AddressDisplayProps) {
  if (!address) {
    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography color="text.secondary">لطفا آدرس تحویل را انتخاب کنید</Typography>
          <Button variant="contained" onClick={onEdit} startIcon={<LocationOnIcon />}>
            انتخاب آدرس
          </Button>
        </Box>
      </Card>
    );
  }

  const fullAddress = `${address.region.title}، ${address.district}، ${address.street}${
    address.floor ? `، طبقه ${address.floor}` : ""
  }${address.room ? `، واحد ${address.room}` : ""}`;

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
            کد پستی: {address.postal} | موبایل: {address.mobile}
          </Typography>
        </Box>
        <Button variant="outlined" size="small" onClick={onEdit} startIcon={<EditIcon />}>
          ویرایش آدرس
        </Button>
      </Box>
    </Card>
  );
}

"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Trash from "icons/Trash";
import { addressService } from "@/services/address.service";

interface Props {
  id: number;
  onDelete: () => void;
}

export default function DeleteAddressBtn({ id, onDelete }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    
    setLoading(true);
    try {
      await addressService.deleteAddress(id);
      onDelete();
    } catch (error) {
      console.error("Failed to delete address:", error);
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

"use client";

import { useState } from "react";
import Location from "icons/Location";
import AddressListItem from "../address-item";
import DashboardHeader from "../../dashboard-header";
import AddAddressDialog from "../add-address-dialog";
import EditAddressDialog from "../edit-address-dialog";
import { useAddresses } from "@/hooks/useAddresses";
import { CircularProgress, Box } from "@mui/material";
import { AddressResource } from "@/types/address.types";

export function AddressPageView() {
  const { addresses, loading, refetch } = useAddresses();
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResource | null>(null);

  const handleEdit = (address: AddressResource) => {
    setSelectedAddress(address);
    setEditDialog(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <DashboardHeader 
        Icon={Location} 
        title="آدرس های من"
        buttonText="افزودن آدرس"
        handleClick={() => setOpenDialog(true)}
      />

      {addresses.map((address) => (
        <AddressListItem 
          key={address.id} 
          address={address} 
          onUpdate={refetch}
          onEdit={handleEdit}
        />
      ))}

      <AddAddressDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        onSuccess={() => {
          setOpenDialog(false);
          refetch();
        }}
      />

      <EditAddressDialog
        open={editDialog}
        address={selectedAddress}
        onClose={() => {
          setEditDialog(false);
          setSelectedAddress(null);
        }}
        onSuccess={() => {
          setEditDialog(false);
          setSelectedAddress(null);
          refetch();
        }}
      />
    </>
  );
}

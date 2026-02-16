"use client";

import AddressForm from "@/components/address/address-form";
import { AddressResource } from "@/types/address.types";

interface AddressFormProps {
  address?: AddressResource;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CheckoutAddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
  return (
    <AddressForm
      address={address}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
}

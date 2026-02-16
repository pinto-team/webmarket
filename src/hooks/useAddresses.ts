"use client";

import { useState, useEffect } from "react";
import { AddressResource } from "@/types/address.types";
import { addressService } from "@/services/address.service";

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<AddressResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return { addresses, loading, error, refetch: fetchAddresses };
};

"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button, Grid, MenuItem, CircularProgress, Alert } from "@mui/material";
import { AddressResource, AddressRequest } from "@/types/address.types";
import { RegionResource } from "@/types/region.types";
import { addressService } from "@/services/address.service";
import { regionService } from "@/services/region.service";
import { useSnackbar } from "notistack";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface AddressFormProps {
  address?: AddressResource;
  onSuccess: () => void;
  onCancel: () => void;
  showActions?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

export default function AddressForm({ address, onSuccess, onCancel, showActions = true, onLoadingChange }: AddressFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { error, fieldErrors, setFieldErrors, handleError, clearErrors } = useErrorHandler();
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<RegionResource[]>([]);
  const [cities, setCities] = useState<RegionResource[]>([]);
  const [formData, setFormData] = useState<AddressRequest & { province_id: number }>({
    region_id: address?.region?.id || 0,
    province_id: 0,
    label: address?.label || "",
    title: address?.title || "",
    mobile: address?.mobile || "",
    district: address?.district || "",
    street: address?.street || "",
    postal: address?.postal || "",
    code: address?.code,
    floor: address?.floor,
    room: address?.room,
  });

  useEffect(() => {
    regionService.getRegions().then(data => {
      // Filter provinces (parent_id === null)
      const provinces = data.filter(region => region.parent_id === null);
      setProvinces(provinces);
      
      // If editing address, find and set the related province
      if (address?.region) {
        const allRegions = data;
        const currentCity = allRegions.find(r => r.id === address.region.id);
        if (currentCity?.parent_id) {
          setFormData(prev => ({ ...prev, province_id: currentCity.parent_id! }));
        }
      }
    }).catch(() => setProvinces([]));
  }, [address]);

  useEffect(() => {
    if (formData.province_id > 0) {
      regionService.getRegions(formData.province_id).then(cities => {
        setCities(cities);
      }).catch(() => setCities([]));
    } else {
      setCities([]);
      if (!address) { // Only reset city if not editing
        setFormData(prev => ({ ...prev, region_id: 0 }));
      }
    }
  }, [formData.province_id, address]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) errors.title = "نام گیرنده الزامی است";
    if (!formData.mobile.trim()) errors.mobile = "شماره موبایل الزامی است";
    else if (!/^09\d{9}$/.test(formData.mobile)) errors.mobile = "شماره موبایل نامعتبر است";
    if (formData.province_id === 0) errors.province_id = "انتخاب استان الزامی است";
    if (formData.region_id === 0) errors.region_id = "انتخاب شهر الزامی است";
    if (!formData.street.trim()) errors.street = "آدرس کامل الزامی است";
    if (!formData.postal.trim()) errors.postal = "کد پستی الزامی است";
    else if (!/^\d{10}$/.test(formData.postal)) errors.postal = "کد پستی باید ۱۰ رقم باشد";
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    if (!validateForm()) return;
    
    setLoading(true);
    onLoadingChange?.(true);

    try {
      const { province_id, ...submitData } = formData;
      if (address) {
        await addressService.updateAddress(address.id, submitData);
        enqueueSnackbar("آدرس با موفقیت ویرایش شد", { variant: "success" });
      } else {
        await addressService.createAddress(submitData);
        enqueueSnackbar("آدرس با موفقیت اضافه شد", { variant: "success" });
      }
      onSuccess();
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} id="address-form">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <TextField
            fullWidth
            label="نام آدرس"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="مثال: خانه، محل کار"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="نام گیرنده"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={!!fieldErrors.title}
            helperText={fieldErrors.title}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="موبایل"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            error={!!fieldErrors.mobile}
            helperText={fieldErrors.mobile}
            required
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            fullWidth
            label="استان"
            value={formData.province_id}
            onChange={(e) => setFormData({ ...formData, province_id: Number(e.target.value), region_id: 0 })}
            error={!!fieldErrors.province_id}
            helperText={fieldErrors.province_id}
            required
          >
            <MenuItem value={0}>انتخاب کنید</MenuItem>
            {provinces.map((province) => (
              <MenuItem key={province.id} value={province.id}>
                {province.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            fullWidth
            label="شهر"
            value={formData.region_id}
            onChange={(e) => setFormData({ ...formData, region_id: Number(e.target.value) })}
            error={!!fieldErrors.region_id}
            helperText={fieldErrors.region_id}
            disabled={formData.province_id === 0}
            required
          >
            <MenuItem value={0}>انتخاب کنید</MenuItem>
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="محله (اختیاری)"
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            error={!!fieldErrors.district}
            helperText={fieldErrors.district}
          />
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="آدرس کامل"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            error={!!fieldErrors.street}
            helperText={fieldErrors.street}
            required
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="کد پستی"
            value={formData.postal}
            onChange={(e) => setFormData({ ...formData, postal: e.target.value })}
            error={!!fieldErrors.postal}
            helperText={fieldErrors.postal}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="پلاک"
            type="number"
            value={formData.code || ""}
            onChange={(e) => setFormData({ ...formData, code: e.target.value ? Number(e.target.value) : undefined })}
            inputProps={{ min: 0 }}
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="طبقه"
            type="number"
            value={formData.floor || ""}
            onChange={(e) => setFormData({ ...formData, floor: e.target.value ? Number(e.target.value) : undefined })}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="واحد"
            type="number"
            value={formData.room || ""}
            onChange={(e) => setFormData({ ...formData, room: e.target.value ? Number(e.target.value) : undefined })}
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>

      {showActions && (
        <Box display="flex" gap={2} mt={3}>
          <Button type="submit" variant="contained" disabled={loading} fullWidth>
            {loading ? <CircularProgress size={24} /> : address ? "ویرایش آدرس" : "افزودن آدرس"}
          </Button>
          <Button variant="outlined" onClick={onCancel} disabled={loading} fullWidth>
            انصراف
          </Button>
        </Box>
      )}
    </Box>
  );
}
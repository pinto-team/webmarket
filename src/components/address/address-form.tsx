"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button, Grid, MenuItem, CircularProgress, Alert } from "@mui/material";

import type { AddressResource, AddressRequest } from "@/types/address.types";
import type { RegionResource } from "@/types/region.types";

import { addressService } from "@/services/address.service";
import { regionService } from "@/services/region.service";

import { useSnackbar } from "notistack";
import { useErrorHandler } from "@/hooks/useErrorHandler";

import { t } from "@/i18n/t";
import { toEnglishNumber } from "@/utils/persian";

interface AddressFormProps {
    address?: AddressResource;
    onSuccess: () => void;
    onCancel: () => void;
    showActions?: boolean;
    onLoadingChange?: (loading: boolean) => void;
}

type FieldErrors = Record<string, string>;

type FormState = AddressRequest & {
    province_id: number;
    // keep numeric optional fields as strings to accept Persian digits safely
    codeStr?: string;
    floorStr?: string;
    roomStr?: string;
};

function onlyDigits(value: string) {
    return value.replace(/[^\d۰-۹]/g, "");
}

function toOptionalNumber(digitsOrPersianDigits?: string): number | undefined {
    if (!digitsOrPersianDigits) return undefined;
    const en = toEnglishNumber(digitsOrPersianDigits);
    if (!en) return undefined;
    const n = Number(en);
    return Number.isFinite(n) ? n : undefined;
}

export default function AddressForm({
                                        address,
                                        onSuccess,
                                        onCancel,
                                        showActions = true,
                                        onLoadingChange,
                                    }: AddressFormProps) {
    const { enqueueSnackbar } = useSnackbar();
    const { error, fieldErrors, setFieldErrors, handleError, clearErrors } = useErrorHandler();

    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState<RegionResource[]>([]);
    const [cities, setCities] = useState<RegionResource[]>([]);

    const [formData, setFormData] = useState<FormState>({
        region_id: address?.region?.id || 0,
        province_id: 0,

        label: address?.label || "",
        title: address?.title || "",
        mobile: address?.mobile || "",
        district: address?.district || "",
        street: address?.street || "",
        postal: address?.postal || "",

        codeStr: address?.code != null ? String(address.code) : "",
        floorStr: address?.floor != null ? String(address.floor) : "",
        roomStr: address?.room != null ? String(address.room) : "",
    });

    useEffect(() => {
        regionService
            .getRegions()
            .then((data) => {
                const provs = data.filter((region) => region.parent_id === null);
                setProvinces(provs);

                // if editing, infer province from city
                if (address?.region) {
                    const currentCity = data.find((r) => r.id === address.region.id);
                    if (currentCity?.parent_id) {
                        setFormData((prev) => ({ ...prev, province_id: currentCity.parent_id! }));
                    }
                }
            })
            .catch(() => setProvinces([]));
    }, [address]);

    useEffect(() => {
        if (formData.province_id > 0) {
            regionService
                .getRegions(formData.province_id)
                .then((list) => setCities(list))
                .catch(() => setCities([]));
        } else {
            setCities([]);
            if (!address) setFormData((prev) => ({ ...prev, region_id: 0 }));
        }
    }, [formData.province_id, address]);

    const validateForm = () => {
        const errors: FieldErrors = {};

        if (!formData.title.trim()) errors.title = t("validation.required");
        if (!formData.mobile.trim()) errors.mobile = t("validation.required");
        else {
            const mobileDigits = toEnglishNumber(onlyDigits(formData.mobile));
            if (!/^09\d{9}$/.test(mobileDigits)) errors.mobile = t("validation.mobile");
        }

        if (formData.province_id === 0) errors.province_id = t("addresses.form.validation.provinceRequired");
        if (formData.region_id === 0) errors.region_id = t("addresses.form.validation.cityRequired");

        if (!formData.street.trim()) errors.street = t("addresses.form.validation.streetRequired");

        if (!formData.postal.trim()) errors.postal = t("addresses.form.validation.postalRequired");
        else {
            const postalDigits = toEnglishNumber(onlyDigits(formData.postal));
            if (!/^\d{10}$/.test(postalDigits)) errors.postal = t("addresses.form.validation.postalLength");
        }

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
            const { province_id, codeStr, floorStr, roomStr, ...rest } = formData;

            const submitData: AddressRequest = {
                ...rest,
                // normalize numeric text inputs into optional numbers
                code: toOptionalNumber(codeStr),
                floor: toOptionalNumber(floorStr),
                room: toOptionalNumber(roomStr),
                // normalize digit-only fields
                postal: toEnglishNumber(onlyDigits(rest.postal || "")),
                mobile: toEnglishNumber(onlyDigits(rest.mobile || "")),
            };

            if (address) {
                await addressService.updateAddress(address.id, submitData);
                enqueueSnackbar(t("messages.addressUpdated"), { variant: "success" });
            } else {
                await addressService.createAddress(submitData);
                enqueueSnackbar(t("messages.addressAdded"), { variant: "success" });
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
                        label={t("addresses.form.label")}
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder={t("addresses.form.labelPlaceholder")}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label={t("addresses.fullName")}
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
                        label={t("addresses.phone")}
                        value={formData.mobile}
                        onChange={(e) =>
                            setFormData({ ...formData, mobile: toEnglishNumber(onlyDigits(e.target.value)) })
                        }
                        inputProps={{ inputMode: "numeric" }}
                        error={!!fieldErrors.mobile}
                        helperText={fieldErrors.mobile}
                        required
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select
                        fullWidth
                        label={t("addresses.province")}
                        value={formData.province_id}
                        onChange={(e) =>
                            setFormData({ ...formData, province_id: Number(e.target.value), region_id: 0 })
                        }
                        error={!!fieldErrors.province_id}
                        helperText={fieldErrors.province_id}
                        required
                    >
                        <MenuItem value={0}>{t("addresses.form.selectPlaceholder")}</MenuItem>
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
                        label={t("addresses.city")}
                        value={formData.region_id}
                        onChange={(e) => setFormData({ ...formData, region_id: Number(e.target.value) })}
                        error={!!fieldErrors.region_id}
                        helperText={fieldErrors.region_id}
                        disabled={formData.province_id === 0}
                        required
                    >
                        <MenuItem value={0}>{t("addresses.form.selectPlaceholder")}</MenuItem>
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
                        label={t("addresses.form.districtOptional")}
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
                        label={t("addresses.address")}
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
                        label={t("addresses.postalCode")}
                        value={formData.postal}
                        onChange={(e) =>
                            setFormData({ ...formData, postal: toEnglishNumber(onlyDigits(e.target.value)) })
                        }
                        inputProps={{ inputMode: "numeric", maxLength: 10 }}
                        error={!!fieldErrors.postal}
                        helperText={fieldErrors.postal}
                        required
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label={t("addresses.form.plaque")}
                        value={formData.codeStr || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, codeStr: toEnglishNumber(onlyDigits(e.target.value)) })
                        }
                        inputProps={{ inputMode: "numeric" }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label={t("addresses.form.floor")}
                        value={formData.floorStr || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, floorStr: toEnglishNumber(onlyDigits(e.target.value)) })
                        }
                        inputProps={{ inputMode: "numeric" }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label={t("addresses.form.unit")}
                        value={formData.roomStr || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, roomStr: toEnglishNumber(onlyDigits(e.target.value)) })
                        }
                        inputProps={{ inputMode: "numeric" }}
                    />
                </Grid>
            </Grid>

            {showActions && (
                <Box display="flex" gap={2} mt={3}>
                    <Button type="submit" variant="contained" disabled={loading} fullWidth>
                        {loading ? <CircularProgress size={24} /> : address ? t("addresses.form.editSubmit") : t("addresses.form.addSubmit")}
                    </Button>

                    <Button variant="outlined" onClick={onCancel} disabled={loading} fullWidth>
                        {t("common.cancel")}
                    </Button>
                </Box>
            )}
        </Box>
    );
}
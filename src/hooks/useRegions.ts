import { useState, useEffect } from "react";
import { RegionResource } from "@/types/region.types";
import { regionService } from "@/services/region.service";
import { t } from "@/i18n/t";

export const useRegions = () => {
    const [provinces, setProvinces] = useState<RegionResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProvinces = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await regionService.getRegions();
                const provinces = data.filter((region) => region.parent_id === null);
                setProvinces(provinces);
            } catch {
                setError(t("addresses.form.errors.provincesFetchError"));
                setProvinces([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProvinces();
    }, []);

    return { provinces, loading, error };
};

export const useCities = (provinceId: number | null) => {
    const [cities, setCities] = useState<RegionResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!provinceId || provinceId === 0) {
            setCities([]);
            return;
        }

        const fetchCities = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await regionService.getRegions(provinceId);
                setCities(data);
            } catch {
                setError(t("addresses.form.errors.citiesFetchError"));
                setCities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, [provinceId]);

    return { cities, loading, error };
};

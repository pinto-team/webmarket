import { useState, useEffect } from "react";
import { GatewayResource } from "@/types/gateway.types";
import { getGateways } from "@/services/gateway.service";
import { t } from "@/i18n/t";

export const useGateways = () => {
    const [gateways, setGateways] = useState<GatewayResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGateways = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getGateways();
                setGateways(data);
            } catch (err: any) {
                const message =
                    err?.response?.data?.message || t("errors.serverError");

                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchGateways();
    }, []);

    return { gateways, loading, error };
};

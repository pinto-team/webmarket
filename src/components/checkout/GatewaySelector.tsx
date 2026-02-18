"use client";

import {
    Box,
    Card,
    Radio,
    RadioGroup,
    FormControlLabel,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import { GatewayResource } from "@/types/gateway.types";
import { t } from "@/i18n/t";

export const GatewaySelector = ({
                                    gateways,
                                    selectedGatewayId,
                                    onSelect,
                                    loading,
                                    error,
                                }: {
    gateways: GatewayResource[];
    selectedGatewayId: number | null;
    onSelect: (gatewayId: number, isShopGateway: boolean) => void;
    loading?: boolean;
    error?: string | null;
}) => {
    const fallbackLogo = "/placeholder.png";

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (gateways.length === 0) {
        return <Alert severity="warning">{t("payment.noGatewayAvailable")}</Alert>;
    }

    return (
        <RadioGroup
            value={selectedGatewayId}
            onChange={(e) => {
                const gatewayId = Number((e.target as HTMLInputElement).value);
                const gateway = gateways.find((g) => g.id === gatewayId);
                onSelect(gatewayId, gateway?.is_shop_specific || false);
            }}
        >
            {gateways.map((gateway) => (
                <Card
                    key={gateway.id}
                    elevation={0}
                    sx={{
                        mb: 2,
                        p: 2,
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor: selectedGatewayId === gateway.id ? "primary.main" : "divider",
                        backgroundColor: "grey.50",
                    }}
                    onClick={() => onSelect(gateway.id, gateway.is_shop_specific || false)}
                >
                    <FormControlLabel
                        value={gateway.id}
                        control={<Radio />}
                        label={
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    width: "100%",
                                }}
                            >
                                {gateway.logo && gateway.logo.trim() !== "" && (
                                    <Box
                                        component="img"
                                        src={gateway.logo}
                                        alt={gateway.title}
                                        width={48}
                                        height={48}
                                        loading="lazy"
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            objectFit: "contain",
                                            display: "block",
                                            borderRadius: 1,
                                            bgcolor: "transparent",
                                        }}
                                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                            const img = e.currentTarget;
                                            if (img.src.includes(fallbackLogo)) return;
                                            img.src = fallbackLogo;
                                        }}
                                    />
                                )}

                                <Box>
                                    <Typography variant="body1" fontWeight="medium">
                                        {gateway.title}
                                    </Typography>

                                    {gateway.is_shop_specific && (
                                        <Typography variant="caption" color="text.secondary">
                                            {t("payment.shopSpecificGateway")}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        }
                        sx={{ width: "100%", m: 0 }}
                    />
                </Card>
            ))}
        </RadioGroup>
    );
};

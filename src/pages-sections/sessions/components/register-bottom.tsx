"use client";

import Typography from "@mui/material/Typography";
import FlexRowCenter from "components/flex-box/flex-row-center";
import BoxLink from "./box-link";
import { t } from "@/i18n/t";

export default function RegisterBottom() {
    return (
        <FlexRowCenter gap={1} mt={3}>
            <Typography variant="body2" color="text.secondary">
                {t("auth.alreadyHaveAccount")}
            </Typography>

            <BoxLink title={t("auth.login")} href="/login" />
        </FlexRowCenter>
    );
}

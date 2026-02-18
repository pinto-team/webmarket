import { Fragment } from "react";
import Typography from "@mui/material/Typography";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import BoxLink from "./box-link";
import { t } from "@/i18n/t";

export default function LoginBottom() {
    return (
        <Fragment>
            <FlexRowCenter gap={1} my={3}>
                <Typography variant="body2" color="text.secondary">
                    {t("auth.dontHaveAccount")}
                </Typography>

                <BoxLink
                    title={t("auth.register")}
                    href="/register"
                />
            </FlexRowCenter>

            <FlexBox
                gap={1}
                py={2}
                borderRadius={1}
                justifyContent="center"
                bgcolor="grey.50"
            >
                <Typography variant="body2" color="text.secondary">
                    {t("auth.forgotPassword")}
                </Typography>

                <BoxLink
                    title={t("auth.resetPassword")}
                    href="/reset-password"
                />
            </FlexBox>
        </Fragment>
    );
}

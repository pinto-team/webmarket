import { Fragment } from "react";
import Typography from "@mui/material/Typography";

import { Heading } from "./styles";
import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

interface Props {
    email: string;
    phone: string;
    address: string;
}
const LRI = "\u2066"; // Left-to-Right Isolate
const PDI = "\u2069"; // Pop Directional Isolate

export function FooterContact({ email, phone, address }: Props) {
    return (
        <Fragment>
            <Heading>{t("footer.contactTitle")}</Heading>

            <Typography variant="body1" sx={{ py: 0.6 }}>
                {toPersianNumber(address ?? "")}
            </Typography>

            <Typography variant="body1" sx={{ py: 0.6 }}>
                {t("footer.emailLabel")}: {email}
            </Typography>

            <Typography variant="body1" sx={{ py: 0.6, mb: 2 }}>
                {t("footer.phoneLabel")}: {LRI}{toPersianNumber(phone ?? "")}{PDI}
            </Typography>
        </Fragment>
    );
}

import Link from "next/link";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { StyledFooter, StyledLink } from "./styles";
import { FooterApps } from "@/components/footer/footer-apps";
import { FooterSocialLinks } from "@/components/footer/footer-social-links";

type FooterLink = { title: string; url: string };

type SocialLinksMap = {
    google?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
};

type Footer2Props = {
    description: string;
    customerCareLinks: FooterLink[];
    socialLinks: SocialLinksMap;
    appleStoreUrl?: string;
    playStoreUrl?: string;
};

export function Footer2({
                            description,
                            customerCareLinks,
                            socialLinks,
                            appleStoreUrl = "#",
                            playStoreUrl = "#",
                        }: Footer2Props) {
    return (
        <StyledFooter>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Link href="/">
                        <Image alt="logo" width={50} height={50} src="/assets/images/logo.svg" />
                    </Link>

                    <Typography variant="body1" sx={{ mt: 3, mb: 2.5, maxWidth: 370 }}>
                        {description}
                    </Typography>

                    <FooterApps appleStoreUrl={appleStoreUrl} playStoreUrl={playStoreUrl} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <div className="links">
                        {customerCareLinks.map(({ title, url }) => (
                            <StyledLink href={url} key={title}>
                                {title}
                            </StyledLink>
                        ))}
                    </div>

                    <FooterSocialLinks links={socialLinks} />
                </Grid>
            </Grid>
        </StyledFooter>
    );
}

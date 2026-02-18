"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMenuCounts } from "@/hooks/useMenuCounts";
import NavItem from "./nav-item";
import { MainContainer } from "./styles";
import { t } from "@/i18n/t";

export function Navigation() {
    const { logout } = useAuth();
    const router = useRouter();
    const counts = useMenuCounts();

    const MENUS = [
        {
            titleKey: "dashboard.title",
            list: [
                { icon: "Packages", href: "/orders", titleKey: "dashboard.orders", count: counts.orders },
                { icon: "Headset", href: "/support-tickets", titleKey: "dashboard.tickets", count: counts.tickets },
                { icon: "Notifications", href: "/notifications", titleKey: "dashboard.notifications", count: counts.notifications },
            ],
        },
        {
            titleKey: "dashboard.accountSettings",
            list: [
                { icon: "User3", href: "/profile", titleKey: "dashboard.profile" },
                { icon: "Location", href: "/address", titleKey: "dashboard.addresses" },
                { icon: "CreditCard", href: "/transactions", titleKey: "dashboard.transactions" },
            ],
        },
    ];

    const handleLogout = async () => {
        await logout();
        router.replace("/"); // فقط خانه — نه login
    };

    return (
        <MainContainer>
            {MENUS.map((menu) => (
                <Box mt={2} key={menu.titleKey}>
                    <Typography
                        fontSize={12}
                        variant="body1"
                        fontWeight={500}
                        color="text.secondary"
                        textTransform="uppercase"
                        sx={{ padding: ".75rem 1.75rem" }}
                    >
                        {t(menu.titleKey)}
                    </Typography>

                    {menu.list.map((listItem) => (
                        <NavItem
                            item={{
                                ...listItem,
                                title: t(listItem.titleKey),
                            }}
                            key={listItem.href}
                        />
                    ))}
                </Box>
            ))}

            <Box px={4} mt={6} pb={2}>
                <Button disableElevation variant="outlined" color="primary" fullWidth onClick={handleLogout}>
                    {t("auth.logout")}
                </Button>
            </Box>
        </MainContainer>
    );
}

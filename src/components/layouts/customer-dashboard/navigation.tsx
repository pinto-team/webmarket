"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMenuCounts } from "@/hooks/useMenuCounts";
import NavItem from "./nav-item";
import { MainContainer } from "./styles";

export function Navigation() {
  const { logout } = useAuth();
  const router = useRouter();
  const counts = useMenuCounts();

  const MENUS = [
    {
      title: "داشبورد",
      list: [
        { icon: "Packages", href: "/orders", title: "سفارشها", count: counts.orders },
        { icon: "Headset", href: "/support-tickets", title: "تیکتهای پشتیبانی", count: counts.tickets },
        { icon: "Notifications", href: "/notifications", title: "اعلانها", count: counts.notifications }
      ]
    },
    {
      title: "تنظیمات حساب",
      list: [
        { icon: "User3", href: "/profile", title: "اطلاعات پروفایل" },
        { icon: "Location", href: "/address", title: "آدرس ها" },
        { icon: "CreditCard", href: "/transactions", title: "تراکنش ها" }
      ]
    }
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <MainContainer>
      {MENUS.map((item) => (
        <Box mt={2} key={item.title}>
          <Typography
            fontSize={12}
            variant="body1"
            fontWeight={500}
            color="text.secondary"
            textTransform="uppercase"
            sx={{ padding: ".75rem 1.75rem" }}>
            {item.title}
          </Typography>

          {item.list.map((listItem) => (
            <NavItem item={listItem} key={listItem.title} />
          ))}
        </Box>
      ))}

      <Box px={4} mt={6} pb={2}>
        <Button disableElevation variant="outlined" color="primary" fullWidth onClick={handleLogout}>
          خروج
        </Button>
      </Box>
    </MainContainer>
  );
}

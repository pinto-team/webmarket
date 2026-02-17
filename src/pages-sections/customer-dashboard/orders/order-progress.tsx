"use client";

import { Fragment } from "react";
import { format } from "date-fns/format";
// MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Done from "@mui/icons-material/Done";
// CUSTOM ICON COMPONENTS
import Delivery from "icons/Delivery";
import PackageBox from "icons/PackageBox";
import TruckFilled from "icons/TruckFilled";
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";
import type { OrderResource } from "@/types/order.types";

// STYLED COMPONENTS
const StyledFlexbox = styled(FlexBetween)(({ theme }) => ({
  flexWrap: "wrap",
  marginTop: "2rem",
  marginBottom: "2rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  "& .line": {
    height: 2,
    minWidth: 50,
    flex: "1 1 0",
    [theme.breakpoints.down("sm")]: {
      flex: "1 1 0",
      height: 2,
      minWidth: 20
    }
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  top: -5,
  right: -5,
  width: 20,
  height: 20,
  position: "absolute",
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.primary.light,
  boxShadow: theme.shadows[1],
  "& svg": { fontSize: 16 }
}));

const StyledStatusAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    width: 48,
    height: 48
  },
  "&.completed": {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main
  },
  "&.pending": {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[100]
  },
  "& svg": {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem"
    }
  }
}));

const DeliveryDateBox = styled("div")(({ theme }) => ({
    textAlign: "center",
    padding: "0.5rem 1rem",
    transition: "all 0.3s ease",
    color: theme.palette.primary.main,
    borderRadius: Number(theme.shape.borderRadius) * 3,
    backgroundColor: theme.palette.primary.light
}));


interface Props {
  order: OrderResource;
}

const STEP_ICONS = [PackageBox, TruckFilled, Delivery];

export default function OrderProgress({ order }: Props) {
  const statusIndex = order.status >= 3 ? 2 : order.status >= 2 ? 1 : 0;

  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        p: "2rem 1.5rem",
        border: "1px solid",
        borderColor: "grey.100"
      }}>
      <StyledFlexbox>
        {STEP_ICONS.map((Icon, ind) => (
          <Fragment key={`step-${ind}`}>
            <Box position="relative">
              <StyledStatusAvatar
                alt={`shipping-step-${ind + 1}`}
                className={ind <= statusIndex ? "completed" : "pending"}>
                <Icon color="inherit" fontSize="large" />
              </StyledStatusAvatar>

              {ind < statusIndex && (
                <StyledAvatar alt="completed-step">
                  <Done color="inherit" />
                </StyledAvatar>
              )}
            </Box>

            {ind < STEP_ICONS.length - 1 && (
              <Box className="line" bgcolor={ind < statusIndex ? "primary.main" : "grey.100"} />
            )}
          </Fragment>
        ))}
      </StyledFlexbox>

      <FlexBox justifyContent={{ xs: "center", sm: "flex-end" }}>
        <DeliveryDateBox>
          وضعیت سفارش: <b>{order.status_label}</b>
        </DeliveryDateBox>
      </FlexBox>
    </Card>
  );
}

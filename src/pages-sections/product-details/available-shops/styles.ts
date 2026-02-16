"use client";

import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2, 3),
  marginBottom: theme.spacing(2),
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  "& .shop-info": {
    flex: 1,
    minWidth: 200
  },
  "& .delivery-info": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    flex: 1
  },
  "& .price-section": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      width: '100%',
      justifyContent: 'space-between'
    }
  },
  "& .price-info": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: theme.spacing(0.5)
  }
}));

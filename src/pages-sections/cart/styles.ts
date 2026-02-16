import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";

export const CartHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

export const CartHeaderTitle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& .title": {
    fontSize: "1.25rem",
    fontWeight: 600
  },
  "& .count": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary
  }
}));

export const ClearAllButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  borderColor: theme.palette.error.main,
  "&:hover": {
    borderColor: theme.palette.error.dark,
    backgroundColor: theme.palette.error.light
  }
}));

export const Wrapper = styled(Card)(({ theme }) => ({
  overflow: "hidden",
  display: "flex",
  flexDirection: "row",
  position: "relative",
  borderRadius: 12,
  marginBottom: "1.5rem",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: theme.spacing(1.5)
  }
}));

export const QuantityButton = styled(ButtonBase)(({ theme }) => ({
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 6,
  backgroundColor: theme.palette.grey[100],
  transition: theme.transitions.create(["background-color"], {
    duration: theme.transitions.duration.short
  }),
  "&:hover": {
    backgroundColor: theme.palette.grey[200]
  },
  "&:disabled": {
    backgroundColor: theme.palette.grey[50],
    cursor: "not-allowed",
    color: theme.palette.text.disabled
  },
  "& svg": {
    fontSize: 16
  }
}));

export const RemoveIconWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  zIndex: 1
}));

export const ImageWrapper = styled("div")(({ theme }) => ({
  width: 180,
  height: 180,
  minWidth: 180,
  position: "relative",
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  img: {
    objectFit: "contain",
    objectPosition: "center"
  },
  [theme.breakpoints.down("sm")]: {
    width: 120,
    height: 120,
    minWidth: 120
  }
}));

export const ContentWrapper = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: theme.spacing(1.5),
  paddingRight: theme.spacing(4),
  minWidth: 0,
  [theme.breakpoints.down("sm")]: {
    paddingRight: 0
  }
}));

export const InfoRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
  flexWrap: "wrap",
  "& .info-item": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5)
  },
  "& svg": {
    fontSize: "1.25rem"
  },
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(1.5),
    fontSize: "0.75rem",
    "& svg": {
      fontSize: "1rem"
    }
  }
}));

export const PriceSection = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontSize: "1.25rem",
  fontWeight: 600
}));

export const BottomSection = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  marginTop: theme.spacing(1),
  flexWrap: "wrap",
  gap: theme.spacing(1.5),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
    gap: theme.spacing(1)
  }
}));

export const QuantityWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5)
}));

export const DetailsLink = styled("a")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  textDecoration: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  "&:hover": {
    color: theme.palette.primary.main
  }
}));

import type { SxProps, Theme } from "@mui/material/styles";

export const bannerSx: SxProps<Theme> = {
    position: "relative",
    borderRadius: 3,
    overflow: "hidden",
    border: "1px solid",
    borderColor: "grey.200",
    minHeight: { xs: 180, sm: 220, md: 260 },
    display: "flex",
    alignItems: "center",
    px: { xs: 2, sm: 4 },
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
};

export const overlaySx: SxProps<Theme> = {
    position: "absolute",
    inset: 0,
    background:
        "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.05) 100%)",
};

export const contentSx: SxProps<Theme> = {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 2,
};

export const titleSx: SxProps<Theme> = {
    color: "rgba(255,255,255,0.85)",
    fontSize: { xs: 12, sm: 16 },
};

export const subtitleSx: SxProps<Theme> = {
    color: "common.white",
    fontWeight: 900,
    lineHeight: 1.2,
    mt: 0.5,
    fontSize: { xs: 18, sm: 22, md: 26 },
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: { xs: 2, sm: 1 },
    maxWidth: { xs: "100%", sm: 520, md: 720 },
};

export const buttonSx: SxProps<Theme> = {
    borderRadius: 2,
    px: 2.25,
    fontWeight: 800,
    whiteSpace: "nowrap",
    mt: { xs: 1.5, sm: 0 },

};
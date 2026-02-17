import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {t} from "i18next";

interface Props {
  description?: string;
}

export default function ProductDescription({ description }: Props) {
  if (!description) {
    return (
      <div>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t("Description")}:
        </Typography>
        <Typography variant="body1">
          {t("No description available")}
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {t("Description")}:
      </Typography>

      <Box 
        sx={{ 
          '& ul': { paddingLeft: 3, marginBottom: 2 },
          '& ol': { paddingLeft: 3, marginBottom: 2 },
          '& li': { marginBottom: 1 },
          '& p': { marginBottom: 2 },
          '& h1, & h2, & h3, & h4, & h5, & h6': { marginTop: 2, marginBottom: 1 }
        }}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}

"use client";

import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { BrandResource } from "@/types/product.types";

interface Props {
  brands: BrandResource[];
  selected?: string;
  onChange: (brandCode?: string) => void;
}

export default function BrandFilter({ brands, selected, onChange }: Props) {
  const handleChange = (brandCode: string, checked: boolean) => {
    console.log('[BrandFilter] handleChange:', { brandCode, checked });
    onChange(checked ? brandCode : undefined);
  };

  return (
    <div>
      <Typography variant="subtitle2" mb={2}>برند</Typography>
      
      <FormGroup>
        {brands?.map((brand) => (
          <FormControlLabel
            key={brand.code}
            control={
              <Checkbox
                checked={selected === brand.code}
                onChange={(e) => handleChange(brand.code, e.target.checked)}
                size="small"
              />
            }
            label={brand.title}
          />
        ))}
      </FormGroup>
    </div>
  );
}

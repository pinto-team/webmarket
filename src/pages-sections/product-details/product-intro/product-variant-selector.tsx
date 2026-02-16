"use client";

import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { VariantGroup } from "@/utils/product";

// ================================================================
interface Props {
  variantGroups: VariantGroup[];
  selectedVariants: Record<string, string>;
  onVariantSelect: (attribute: string, value: string) => void;
  isVariantAvailable: (attribute: string, value: string) => boolean;
}
// ================================================================

export default function ProductVariantSelector({ 
  variantGroups, 
  selectedVariants, 
  onVariantSelect,
  isVariantAvailable 
}: Props) {
  if (variantGroups.length === 0) return null;

  return (
    <>
      {variantGroups.map((group) => (
        <div className="mb-1" key={group.attribute}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {group.attribute}
          </Typography>

          <div className="variant-group">
            {group.values.map((value) => {
              const isActive = selectedVariants[group.attribute] === value;
              const isAvailable = isVariantAvailable(group.attribute, value);

              return (
                <Chip
                  key={value}
                  label={value}
                  size="small"
                  color="primary"
                  onClick={() => onVariantSelect(group.attribute, value)}
                  variant={isActive ? "filled" : "outlined"}
                  disabled={!isAvailable}
                />
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

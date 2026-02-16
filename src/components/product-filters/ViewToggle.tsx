"use client";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";

interface Props {
  view: "grid" | "list";
  onChange: (view: "grid" | "list") => void;
}

export default function ViewToggle({ view, onChange }: Props) {
  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={(_, newView) => newView && onChange(newView)}
      size="small"
    >
      <ToggleButton value="grid">
        <GridViewIcon />
      </ToggleButton>
      <ToggleButton value="list">
        <ViewListIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

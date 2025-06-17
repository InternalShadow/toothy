import React, { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import InvertColorsIcon from "@mui/icons-material/InvertColors";

/**
 * Toggle button that inverses all page colors by applying an `invert-colors`
 * class to the root `<html>` element. The state is persisted in `localStorage`
 * so preference survives page reloads.
 */
export default function InvertColorButton() {
  // Read initial preference once to avoid hydration mismatch in future SSR
  const [enabled, setEnabled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("invertColors")) ?? false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) root.classList.add("invert-colors");
    else root.classList.remove("invert-colors");

    try {
      localStorage.setItem("invertColors", JSON.stringify(enabled));
    } catch {
      /* ignore */
    }
  }, [enabled]);

  return (
    <Tooltip title={enabled ? "Disable color inversion" : "Invert colors"}>
      <IconButton size='small' onClick={() => setEnabled((v) => !v)}>
        <InvertColorsIcon />
      </IconButton>
    </Tooltip>
  );
}

import React, { useState } from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material";

/**
 * Compact toolbar for switching layouts, saving free-form layout to
 * localStorage, and opening the widget store.  Handles its own Snackbar
 * feedback.
 */
export default function LayoutToolbar({
  layoutMode,
  onToggleLayout,
  onSaveLayout,
  onAddWidget,
}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSave = () => {
    onSaveLayout?.();
    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        display: { xs: "none", sm: "none", md: "flex" },
        justifyContent: "flex-end",
        p: 2,
      }}
    >
      <Button variant='contained' color='primary' onClick={onToggleLayout}>
        switch to {layoutMode === "grid" ? "Freeform" : "Grid View"} Layout
      </Button>
      {layoutMode === "list" && (
        <Button
          sx={{ ml: 2 }}
          variant='outlined'
          color='secondary'
          onClick={handleSave}
        >
          Save Layout
        </Button>
      )}
      {layoutMode === "list" && (
        <Button
          sx={{ ml: 2 }}
          variant='outlined'
          color='secondary'
          onClick={onAddWidget}
        >
          Add Widget
        </Button>
      )}

      {/* feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity='success'
          sx={{ width: "100%" }}
          onClose={() => setSnackbarOpen(false)}
        >
          Layout saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

import React from "react";
import { Box, Typography, Stack, BottomNavigation } from "@mui/material";
// import { Copyright } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      sx={{
        // position: "relative",
        // bottom: 0,
        width: "100%",
        boxShadow: 1,
        backgroundColor: "background.paper",
      }}
    >
      <Stack
        sx={{
          spacing: 2,
        }}
      >
        <Box
          sx={{
            height: "100px",
            backgroundColor: "background.paper",
            color: "black",
            textAlign: "center",
          }}
        >
          <Typography>© Toothy 2025</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

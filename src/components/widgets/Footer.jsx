import React from "react";
import { Box, Typography, Stack } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
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
          <Typography sx={{ paddingTop: "20px" }}>© Toothy 2025</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function CaseStats() {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        minHeight: 200,
      }}
    >
      <Typography
        sx={{ fontWeight: 700, fontSize: 18, color: "black", mb: 0.5 }}
      >
        Case Overview
      </Typography>
      <Typography sx={{ fontWeight: 700, fontSize: 32, mb: 3 }}>
        5 Active Cases
      </Typography>
      <Box display='flex' justifyContent='space-between' mt={1}>
        <Box>
          <Typography sx={{ fontSize: 14, color: "#222", fontWeight: 500 }}>
            &#9650; Due Soon
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: "black" }}>
            Next Review
          </Typography>
        </Box>
        <Box textAlign='right'>
          <Typography sx={{ fontSize: 14, color: "#222", fontWeight: 500 }}>
            ● In Review
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: "black" }}>
            3 Cases
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

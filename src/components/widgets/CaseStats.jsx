import React, { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function CaseStats({ stats, isFreeform = false }) {
  const [activeCases, setActiveCases] = useState(0);
  const [inReview, setInReview] = useState(0);

  useEffect(() => {
    setActiveCases(stats.inProgress);
    setInReview(stats.inReview);
  }, [stats]);

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        width: isFreeform ? "100%" : "auto",
        height: isFreeform ? "100%" : "auto",
        minHeight: isFreeform ? "unset" : "20vh",
        minWidth: isFreeform ? "unset" : "15vw",
      }}
    >
      <Typography
        sx={{ fontWeight: 700, fontSize: 18, color: "black", mb: 0.5 }}
      >
        Case Overview
      </Typography>
      <Typography sx={{ fontWeight: 700, fontSize: 32, mb: 3 }}>
        {activeCases} Active Cases
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
            {inReview} Cases
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

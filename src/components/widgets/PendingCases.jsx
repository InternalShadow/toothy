import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function PendingCases({ cases, isFreeform = false }) {
  const pendingCount = cases.length;

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        p: 3,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: isFreeform ? "100%" : "auto",
        height: isFreeform ? "100%" : "auto",
        minHeight: isFreeform ? "unset" : "24vh",
        minWidth: isFreeform ? "unset" : "15vw",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          mb: 2,
        }}
      >
        <CircularProgress
          variant='determinate'
          value={pendingCount * 10}
          size={80}
          thickness={4}
          sx={{ color: "#2196f3", zIndex: 1 }}
        />
        <CircularProgress
          variant='determinate'
          value={100}
          size={80}
          thickness={4}
          sx={{
            color: "lightgray",
            position: "absolute",
            left: 0,
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant='caption'
            component='div'
            sx={{ fontWeight: 700, fontSize: 20 }}
            color={pendingCount > 0 ? "#2196f3" : "#000"}
          >
            {pendingCount * 10}%
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 22,
          color: "black",
          mb: 1,
        }}
      >
        Pending Cases
      </Typography>
      <Typography sx={{ color: "#222", fontSize: 16 }}>
        Awaiting Review
      </Typography>
    </Box>
  );
}

import React from "react";
import { Box, Typography } from "@mui/material";

export default function ProgressOverviewCard({ stats, isFreeform = false }) {
  const progressData = [
    {
      label: "New Cases",
      value: stats.newCases,
      color: "#4f6bed",
    },
    { label: "Pending", value: stats.pending, color: "#ffa726" },
    {
      label: "In Progress",
      value: stats.inProgress,
      color: "#42a5f5",
    },
    {
      label: "Completed",
      value: stats.completed,
      color: "#66bb6a",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        p: 3,
        boxSizing: "border-box",
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        width: isFreeform ? "100%" : "auto",
        height: isFreeform ? "100%" : "auto",
        minWidth: isFreeform ? "unset" : "20vw",
      }}
    >
      <Typography variant='h6' sx={{ fontWeight: 700, mb: 3, color: "black" }}>
        Progress Overview
      </Typography>

      {progressData.map(({ label, value, color }) => (
        <Box
          key={label}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          {/* Progress Bar */}
          <Box
            sx={{
              position: "relative",
              height: 24,
              flex: 1,
              minWidth: 0,
              backgroundColor: "white",
              borderRadius: 1,
              boxShadow: "0 1px 2px rgba(0,0,0,1)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${value * 10}%`,
                backgroundColor: color,
              }}
            />
          </Box>

          {/* Percentage and Label */}
          <Box
            sx={{
              width: 120,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: "black",
                width: 45,
                flexShrink: 0,
              }}
            >
              {value * 10}%
            </Typography>
            <Typography
              sx={{
                color: "black",
                fontWeight: 500,
              }}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

import React from "react";
import { Box, Typography } from "@mui/material";

const progressData = [
  { label: "New Cases", value: 50, color: "#4f6bed" }, // Indigo blue (matches sidebar)
  { label: "Pending", value: 30, color: "#ffa726" }, // Soft amber/orange
  { label: "In Progress", value: 20, color: "#42a5f5" }, // Light blue
  { label: "Completed", value: 10, color: "#66bb6a" }, // Soft green
];

export default function ProgressOverviewCard() {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        p: 3,
        width: "100%",
        boxSizing: "border-box",
        boxShadow: 3,
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
            justifyContent: "flex-start",
            mb: 2,
            gap: 2,
          }}
        >
          {/* Progress Bar */}
          <Box
            sx={{
              position: "relative",
              width: 200,
              height: 24,
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
                width: `${value}%`,
                backgroundColor: color,
              }}
            />
          </Box>

          {/* Percentage and Label */}
          <Box sx={{ minWidth: 100 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: "black",
                display: "inline-block",
                width: 40,
              }}
            >
              {value}%
            </Typography>
            <Typography
              sx={{ color: "black", display: "inline-block", fontWeight: 500 }}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

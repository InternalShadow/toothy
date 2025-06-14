import React from "react";
import { Box, Typography } from "@mui/material";

export default function ProgressOverviewCard({ stats }) {
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
        minWidth: "20vw",
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
              minWidth: "10vw",
              maxWidth: "15vw",
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
                width: `${value * 10}%`,
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
              {value * 10}%
            </Typography>
            <Typography
              sx={{
                color: "black",
                display: "inline-block",
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

import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";

const STATES = [
  { key: "total", label: "Total Cases" },
  { key: "completed", label: "Completed" },
  { key: "pending", label: "Pending" },
  { key: "inProgress", label: "In Progress" },
  { key: "inReview", label: "In Review" },
  { key: "uploaded", label: "Uploaded" },
];

export default function ActiveCasesCard({ stats }) {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const currentState = STATES[currentStateIndex];

  const handlePrevious = () => {
    setCurrentStateIndex((prev) => (prev === 0 ? STATES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentStateIndex((prev) => (prev === STATES.length - 1 ? 0 : prev + 1));
  };

  const getPercentage = () => {
    const value = stats[currentState.key];
    return Math.round((value / stats.total) * 100);
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        p: 3,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        maxHeight: "235px",
        boxShadow: 3,
        minWidth: "20vw",
      }}
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        mb={1}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 22,
              color: "black",
            }}
          >
            {currentState.label}
          </Typography>
          <Typography sx={{ color: "#222", fontSize: 16 }}>
            {getPercentage()}% of Total
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap={1}>
          <IconButton
            size='small'
            sx={{ color: "#222" }}
            onClick={handlePrevious}
          >
            <svg width='20' height='20' viewBox='0 0 20 20'>
              <path
                d='M13 5l-5 5 5 5'
                stroke='#222'
                strokeWidth='2'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </IconButton>
          <IconButton size='small' sx={{ color: "#222" }} onClick={handleNext}>
            <svg width='20' height='20' viewBox='0 0 20 20'>
              <path
                d='M7 5l5 5-5 5'
                stroke='#222'
                strokeWidth='2'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </IconButton>
        </Box>
      </Box>
      <Box display='flex' alignItems='center' mt={2}>
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 3,
          }}
        >
          <svg width='32' height='32' viewBox='0 0 32 32'>
            <rect width='32' height='32' rx='6' fill='#000' />
            <path
              d='M16 10v8M12 14h8'
              stroke='#fff'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        </Box>
        <Box flex={1}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 28,
              mb: 1,
              color: "black",
              textWrap: "wrap",
            }}
          >
            {getPercentage()}% {currentState.label}
          </Typography>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              overflow: "hidden",
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: `${getPercentage()}%`,
                height: "10px",
                backgroundColor: "#111",
                borderRadius: 1,
                transition: "width 0.3s",
              }}
            />
          </Box>
          <Typography sx={{ color: "#222", fontSize: 16 }}>
            {stats[currentState.key]} out of {stats.total} cases
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

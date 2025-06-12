import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function PendingCases() {
  // Bar heights as percentages for the mini bar chart
  const barHeights = [20, 35, 45, 60, 75, 90, 90, 35, 20, 10, 5, 2];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        maxHeight: 200,
      }}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
          Pending Action
        </Typography>
        <Box display='flex' alignItems='center' gap={1}>
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            style={{ verticalAlign: "middle" }}
          >
            <circle cx='10' cy='10' r='10' fill='#111' />
            <path
              d='M10 6v8M10 6l-3 3M10 6l3 3'
              stroke='#fff'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Delay</Typography>
        </Box>
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: 32, mb: 3 }}>
        2 Cases
      </Typography>
      <Box display='flex' alignItems='flex-end' gap={1} mt={2}>
        {barHeights.map((h, i) => (
          <Box
            key={i}
            sx={{
              width: 18,
              height: `${h}px`,
              backgroundColor: "#ccc",
              borderRadius: 1,
              transition: "height 0.3s",
            }}
          />
        ))}
      </Box>
    </Paper>
  );
}

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ResizableDraggableWidget from "../layout/ResizeableDraggableWidget";

export default function ActiveCasesCard() {
  const percent = 75;
  const total = 20;
  const completed = 15;

  return (
    // <ResizableDraggableWidget
    //   defaultPosition={{ x: 100, y: 100 }}
    //   defaultSize={{ width: 300, height: 250 }}
    // >
    <Box
      sx={{
        backgroundColor: "background.paper",
        // border: '2px solid #2196f3',
        borderRadius: 2,
        p: 3,

        boxSizing: "border-box",
        // height: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        maxHeight: "235px",
        boxShadow: 3,
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
              // textWrap: "wrap",
            }}
          >
            Active Cases
          </Typography>
          <Typography sx={{ color: "#222", fontSize: 16 }}>
            In Review
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap={1}>
          <IconButton size='small' sx={{ color: "#222" }}>
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
          <IconButton size='small' sx={{ color: "#222" }}>
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
            // width: 56,
            // height: 56,
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
            {percent}% Completion
          </Typography>
          <Box
            sx={{
              // width: '100%',
              // height: 10,
              backgroundColor: "#fff",
              borderRadius: 1,
              overflow: "hidden",
              mb: 1,
            }}
          >
            <Box
              sx={{
                // width: `${percent}%`,
                // height: '100%',
                backgroundColor: "#111",
                borderRadius: 1,
                transition: "width 0.3s",
              }}
            />
          </Box>
          <Typography sx={{ color: "#222", fontSize: 16 }}>
            {completed} out of {total} cases
          </Typography>
        </Box>
      </Box>
    </Box>
    // </ResizableDraggableWidget>
  );
}

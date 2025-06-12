import React from "react";
import { Box, Typography, Paper, Divider, ButtonBase } from "@mui/material";

const cases = [
  {
    icon: (
      <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
        <rect width='32' height='32' rx='6' fill='#000' />
        <path
          d='M10 16h12M16 10v12'
          stroke='#fff'
          strokeWidth='2'
          strokeLinecap='round'
        />
      </svg>
    ),
    title: "Case #12345",
    subtitle: "Dental Case",
    right: (
      <Typography sx={{ fontWeight: 700, fontSize: 22 }}>Status</Typography>
    ),
    highlight: false,
  },
  {
    icon: (
      <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
        <rect width='32' height='32' rx='6' fill='#000' />
        <path
          d='M10 12h12v8H10z'
          stroke='#fff'
          strokeWidth='2'
          strokeLinejoin='round'
        />
        <path
          d='M14 16h4'
          stroke='#fff'
          strokeWidth='2'
          strokeLinecap='round'
        />
      </svg>
    ),
    title: "Dental Cases",
    subtitle: "New Case",
    right: (
      <Typography sx={{ fontWeight: 700, fontSize: 22 }}>Pending</Typography>
    ),
    highlight: false,
  },
  {
    icon: (
      <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
        <rect width='32' height='32' rx='6' fill='#000' />
        <path
          d='M16 10v12M16 10l-3 3M16 10l3 3'
          stroke='#fff'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    title: "Image Upload",
    subtitle: "John Doe",
    right: (
      <Typography sx={{ fontWeight: 700, fontSize: 22 }}>Submitted</Typography>
    ),
    highlight: true,
  },
  {
    icon: (
      <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
        <rect width='32' height='32' rx='6' fill='#000' />
        <path
          d='M12 20V12h8v8z'
          stroke='#fff'
          strokeWidth='2'
          strokeLinejoin='round'
        />
        <path
          d='M16 16h.01'
          stroke='#fff'
          strokeWidth='2'
          strokeLinecap='round'
        />
      </svg>
    ),
    title: "Dental Images",
    subtitle: "X-rays, Impressions",
    right: (
      <Typography sx={{ fontWeight: 700, fontSize: 22 }}>Uploaded</Typography>
    ),
    highlight: false,
  },
  {
    icon: (
      <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
        <rect width='32' height='32' rx='6' fill='#000' />
        <path
          d='M10 22l6-12 6 12'
          stroke='#fff'
          strokeWidth='2'
          strokeLinejoin='round'
        />
      </svg>
    ),
    title: "Priority: High",
    subtitle: "Workflow Status",
    right: (
      <Typography sx={{ fontWeight: 700, fontSize: 22 }}>Turnaround</Typography>
    ),
    highlight: false,
  },
];

const filters = [
  { label: "New", active: true },
  { label: "In Review", active: false },
  { label: "Completed", active: false },
];

export default function CaseList() {
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "white",
      }}
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        mb={1}
      >
        <Typography variant='h4' sx={{ fontWeight: 700, color: "black" }}>
          Case List
        </Typography>
        <Typography
          sx={{
            color: "#111",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          View All
        </Typography>
      </Box>
      <Box display='flex' alignItems='center' gap={3} mb={3}>
        {filters.map((f) => (
          <Typography
            key={f.label}
            sx={{
              fontWeight: 700,
              fontSize: 18,
              borderBottom: f.active ? "3px solid #000" : "none",
              color: f.active ? "#000" : "#888",
              pb: 0.5,
              cursor: "pointer",
            }}
          >
            {f.label}
          </Typography>
        ))}
      </Box>
      <Box>
        {cases.map((c, i) => (
          <React.Fragment key={c.title}>
            <Paper
              elevation={c.highlight ? 3 : 0}
              sx={{
                display: "flex",
                alignItems: "center",
                background: c.highlight ? "#fff" : "transparent",
                boxShadow: c.highlight ? "0 4px 24px rgba(0,0,0,0.07)" : "none",
                borderRadius: c.highlight ? 2 : 0,
                p: c.highlight ? 3 : 0,
                my: c.highlight ? 2 : 0,
                minHeight: 80,
                mb: 0,
              }}
            >
              <Box mr={3} display='flex' alignItems='center'>
                {c.icon}
              </Box>
              <Box flex={1}>
                <Typography sx={{ fontWeight: 700, fontSize: 22 }}>
                  {c.title}
                </Typography>
                <Typography sx={{ color: "#222", fontSize: 16 }}>
                  {c.subtitle}
                </Typography>
              </Box>
              <Box minWidth={120} textAlign='right'>
                {c.right}
              </Box>
            </Paper>
            {(i === 0 || i === 3) && <Divider sx={{ my: 3 }} />}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

import React, { useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

const filters = [
  { label: "New", active: true },
  { label: "In Review", active: false },
  { label: "Completed", active: false },
  { label: "Uploaded", active: false },
  { label: "Pending", active: false },
  { label: "In Progress", active: false },
  { label: "Submitted", active: false },
];

const getCaseIcon = (category) => {
  switch (category) {
    case "New Case":
      return (
        <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
          <rect width='32' height='32' rx='6' fill='#000' />
          <path
            d='M10 16h12M16 10v12'
            stroke='#fff'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>
      );
    case "Dental Images":
      return (
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
      );
    case "Image Upload":
      return (
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
      );
    default:
      return (
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
      );
  }
};

export default function CaseList({ cases, isFreeform = false }) {
  const [activeFilter, setActiveFilter] = useState("New");

  const filteredCases = cases.filter((c) => {
    switch (activeFilter) {
      case "New":
        return c.cat === "New Case";
      case "In Review":
        return c.stat === "In Review";
      case "Completed":
        return c.stat === "Completed";
      case "Uploaded":
        return c.stat === "Uploaded";
      case "Pending":
        return c.stat === "Pending";
      case "In Progress":
        return c.stat === "In Progress";
      case "Submitted":
        return c.stat === "Submitted";
      default:
        return true;
    }
  });

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 2,
        boxShadow: isFreeform ? "none" : 3,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: isFreeform ? "100%" : "auto",
        height: isFreeform ? "100%" : "auto",
        minWidth: isFreeform ? "unset" : "20vw",
        minHeight: isFreeform ? "unset" : "30vh",
        maxHeight: isFreeform ? "unset" : "50vh",
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
            mr: isFreeform ? 2 : 0,
            pr: isFreeform ? 2 : 0,
          }}
        >
          View All
        </Typography>
      </Box>
      <Box
        display='flex'
        alignItems='center'
        flexWrap='nowrap'
        gap={3}
        mb={3}
        maxWidth={isFreeform ? "95%" : { xs: "80vw", sm: "80vw", md: "25vw" }}
        borderBottom='1px solid #e0e0e0'
        pt={1}
        pb={3}
        pr={isFreeform ? 4 : 0}
        sx={{
          alignSelf: "flex-start",
          overflowX: "auto",
          overflowY: "hidden",

          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0,0,0,0.4)",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,0,0,0.2) transparent",
        }}
      >
        {filters.map((f) => (
          <Typography
            key={f.label}
            onClick={() => setActiveFilter(f.label)}
            sx={{
              fontWeight: 700,
              fontSize: 14,
              borderBottom:
                activeFilter === f.label ? "3px solid #000" : "none",
              color: activeFilter === f.label ? "#000" : "#888",
              pb: 0.5,
              cursor: "pointer",
            }}
          >
            {f.label}
          </Typography>
        ))}
      </Box>
      <Box
        sx={{
          maxWidth: isFreeform ? "92%" : "auto",

          flex: 1,
          overflowY: "scroll",
          pr: isFreeform ? 4 : 2,

          minHeight: 0,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0,0,0,0.4)",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,0,0,0.2) transparent",
        }}
      >
        {filteredCases.map((c, i) => (
          <React.Fragment key={c.id}>
            <Paper
              elevation={c.stat === "In Review" ? 3 : 0}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: c.stat === "In Review" ? "#f5f5f5" : "transparent",
                boxShadow:
                  c.stat === "In Review"
                    ? "0 4px 24px rgba(0,0,0,0.07)"
                    : "none",
                borderRadius: c.stat === "In Review" ? 2 : 0,
                p: c.stat === "In Review" ? 3 : 0,
                my: c.stat === "In Review" ? 2 : 0,
                minHeight: 80,
                mb: isFreeform ? 2 : 0,
              }}
            >
              <Box mr={3} display='flex' alignItems='center'>
                {getCaseIcon(c.cat)}
              </Box>
              <Box flex={1}>
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                  Case #{c.cas}
                </Typography>
                <Typography sx={{ color: "#222", fontSize: 16 }}>
                  {c.cat}
                </Typography>
              </Box>
              <Box minWidth={120} textAlign='right'>
                <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
                  {c.stat}
                </Typography>
              </Box>
            </Paper>
            {i < filteredCases.length - 1 && <Divider sx={{ my: 3 }} />}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

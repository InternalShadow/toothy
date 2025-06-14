import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

export default function Chart({ chartData, isFreeform = false }) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#111",
        boxShadow: "none",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        width: isFreeform ? "100%" : "auto",
        height: isFreeform ? "100%" : "auto",
        minHeight: isFreeform ? "unset" : "24vh",
        minWidth: isFreeform ? "unset" : "25vw",
      }}
    >
      <Typography
        variant='h6'
        gutterBottom
        sx={{
          color: "#fff",
          fontWeight: 700,
          // border: "1px solid #2196f3",

          display: "inline-block",
          px: 1.5,
          borderRadius: 1,
          mb: 2,
        }}
      >
        Actions Needed
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
        <BarChart
          series={[
            {
              data: chartData.scans,
              label: "Scans",
              color: "cyan",
            },
            {
              data: chartData.molds,
              label: "Molds",
              color: "white",
            },
            {
              data: chartData.impressions,
              label: "Impressions",
              color: "orange",
            },
          ]}
          xAxis={[
            {
              data: months,
              scaleType: "band",
              label: "Month",
              labelStyle: { fill: "#fff", fontWeight: 500 },
              tickLabelStyle: { fill: "#fff", fontWeight: 500 },
            },
          ]}
          yAxis={[
            {
              label: "Cases",
              tickLabelStyle: { fill: "#fff", fontWeight: 500 },
              labelStyle: { fill: "#fff", fontWeight: 700 },
            },
          ]}
          sx={{
            backgroundColor: "#111",

            mr: isFreeform ? 2 : 0,
            pr: isFreeform ? 2 : 0,
            ".MuiChartsAxis-label, .MuiChartsAxis-tickLabel": {
              fill: "#fff",
            },
            ".MuiChartsLegend-root": {
              color: "#fff",
              fontWeight: 500,
              fontSize: 16,
              m: isFreeform ? "auto" : 0,
              mr: isFreeform ? 2 : 0,
              pr: isFreeform ? 2 : 0,
            },
            ".MuiChartsGrid-line": {
              stroke: "#444",
              strokeWidth: 1,
            },
          }}
          legend={{
            position: { vertical: "top", horizontal: "middle" },
            labelStyle: { color: "#fff", fontWeight: 500 },
          }}
        />
      </Box>
    </Paper>
  );
}

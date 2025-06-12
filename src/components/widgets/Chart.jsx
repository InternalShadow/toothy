import React from "react";
import { Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

export default function Chart() {
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

  // Separate data series for each metric
  const scans = [12, 15, 18, 14, 16, 20, 22, 19, 17, 21, 23, 25];
  const molds = [8, 10, 12, 11, 13, 15, 17, 16, 14, 18, 19, 21];
  const impressions = [5, 7, 9, 8, 10, 12, 14, 13, 11, 15, 16, 18];

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#111",
        boxShadow: "none",
        color: "#fff",
      }}
    >
      <Typography
        variant='h6'
        gutterBottom
        sx={{
          color: "#fff",
          fontWeight: 700,
          border: "2px solid #2196f3",
          display: "inline-block",
          px: 1.5,
          borderRadius: 1,
          mb: 2,
        }}
      >
        Actions Needed
      </Typography>
      <BarChart
        series={[
          {
            data: scans,
            label: "Scans",
            color: "cyan",
          },
          {
            data: molds,
            label: "Molds",
            color: "white",
          },
          {
            data: impressions,
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
        height={300}
        sx={{
          backgroundColor: "#111",
          ".MuiChartsAxis-label, .MuiChartsAxis-tickLabel": {
            fill: "#fff",
          },
          ".MuiChartsLegend-root": {
            color: "#fff",
            fontWeight: 500,
            fontSize: 16,
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
    </Paper>
  );
}

import React from "react";
import { Box, Grid } from "@mui/material";
import DashBoardGrid from "./layout/DashBoardGrid";
import CaseStats from "./widgets/CaseStats";
import PendingCases from "./widgets/PendingCases";
import Sidebar from "./Sidebar";
import Header from "./widgets/Header";
import Chart from "./widgets/Chart";
import ProgressOverviewCard from "./widgets/ProgressOverviewCard";
import CaseList from "./widgets/CaseList";
import ActiveCasesCard from "./widgets/ActiveCasesCard";
import Footer from "./widgets/Footer";

export default function CRMPrototypeDashboard() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        minWidth: 0,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box sx={{ display: { xs: "none", md: "block" }, width: 240 }}>
        <Sidebar />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: "100%",
          minWidth: 0,
        }}
      >
        <Header />
        <Box sx={{ flexGrow: 1 }}>
          <DashBoardGrid>
            <Box display='flex' width='100%' gap={2}>
              <Box flexGrow={1}>
                <Grid container spacing={3}>
                  <Grid size={4} item xs={12} sm={6} md={4}>
                    <CaseStats />
                  </Grid>
                  <Grid size={4} item xs={12} sm={6} md={4}>
                    <PendingCases />
                  </Grid>
                  <Grid size={4} item xs={12} sm={6} md={4}>
                    <ActiveCasesCard />
                  </Grid>
                  <Grid size={8} item xs={12} sm={12} md={12}>
                    <Chart />
                  </Grid>
                  <Grid size={4} item xs={12} sm={6} md={4}>
                    <ProgressOverviewCard />
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  width: { xs: "100%", md: "50%" },
                  mt: { xs: 4, md: 0 },
                }}
              >
                <CaseList />
              </Box>
            </Box>
          </DashBoardGrid>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

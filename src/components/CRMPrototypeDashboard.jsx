import React, { useMemo, useState } from "react";
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
import { generateRandomCases } from "./data/CaseData";
import DashboardDropZone from "./layout/DashBoardDropZone";
import InteractiveWidget from "./layout/InteractiveWidget";

export default function CRMPrototypeDashboard() {
  const caseData = useMemo(() => generateRandomCases(10), []);

  const stats = useMemo(() => {
    const newCases = caseData.filter((c) => c.cat === "New Case").length;
    const total = caseData.length;
    const completed = caseData.filter((c) => c.stat === "Completed").length;
    const pending = caseData.filter((c) => c.stat === "Pending").length;
    const inReview = caseData.filter((c) => c.stat === "In Review").length;
    const uploaded = caseData.filter((c) => c.stat === "Uploaded").length;
    const inProgress = caseData.filter((c) => c.stat === "In Progress").length;

    return {
      total,
      newCases,
      completed,
      pending,
      inProgress,
      inReview,
      uploaded,
      completionPercentage: Math.round((completed / total) * 100),
    };
  }, [caseData]);

  const [widgets, setWidgets] = useState([
    "caseStats",
    "pendingCases",
    "activeCasesCard",
    "chart",
    "progressOverviewCard",
    "caseList",
  ]);

  const widgetMap = {
    caseStats: <CaseStats stats={stats} />,
    pendingCases: (
      <PendingCases cases={caseData.filter((c) => c.stat === "Pending")} />
    ),
    activeCasesCard: <ActiveCasesCard stats={stats} />,
    chart: <Chart data={caseData} />,
    progressOverviewCard: <ProgressOverviewCard stats={stats} />,
    caseList: <CaseList cases={caseData} />,
  };

  const [dragOverId, setDragOverId] = useState(null);

  const resetDashboard = () => {
    setWidgets([
      "caseStats",
      "pendingCases",
      "activeCasesCard",
      "chart",
      "progressOverviewCard",
      "caseList",
    ]);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        minWidth: 0,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "block", lg: "flex", xl: "flex" },
          minWidth: 0,
          backgroundColor: "#f5f5f5",
        }}
      >
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
          <DashboardDropZone onReorderWidgets={setWidgets}>
            <DashBoardGrid>
              <Box display='flex' width='100%' gap={2}>
                <Box flexGrow={1}>
                  <Grid container spacing={3}>
                    {widgets.map((widget) => (
                      <Grid
                        key={widget}
                        size={{
                          xs: 12,
                          sm: 6,
                          md:
                            widget === "caseStats"
                              ? 4
                              : widget === "caseList"
                              ? 8
                              : widget === "chart"
                              ? 12
                              : 3,
                          lg: widget === "chart" ? 6 : 3,
                          xl: widget === "chart" ? 6 : 3,
                        }}
                      >
                        <InteractiveWidget
                          id={widget}
                          key={widget}
                          onDragEnter={(id) => setDragOverId(id)}
                          onDragLeave={() => setDragOverId(null)}
                        >
                          {widgetMap[widget]}
                        </InteractiveWidget>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </DashBoardGrid>
          </DashboardDropZone>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { Box, Grid, Button } from "@mui/material";
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

  // Load persisted freeform layout (order & positions)
  let persistedOrder = null;
  let persistedPositions = null;
  try {
    const raw =
      typeof window !== "undefined" &&
      localStorage.getItem("crmFreeformLayout");
    if (raw) {
      const parsed = JSON.parse(raw);
      persistedOrder = parsed?.order;
      persistedPositions = parsed?.positions;
    }
  } catch (_) {
    // ignore
  }

  const defaultOrder = [
    "caseStats",
    "pendingCases",
    "activeCasesCard",
    "chart",
    "progressOverviewCard",
    "caseList",
  ];

  const [widgets, setWidgets] = useState(persistedOrder ?? defaultOrder);

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
  const [draggedId, setDraggedId] = useState(null);
  const [layoutMode, setLayoutMode] = useState("grid");

  const hasLoaded = useRef(false);
  const hasUserMovedWidget = useRef(false);

  // Track absolute x/y positions for widgets in freeform mode
  const [widgetPositions, setWidgetPositions] = useState(() => {
    if (persistedPositions) {
      hasLoaded.current = true;
      return persistedPositions;
    }
    const initial = {};
    (persistedOrder ?? defaultOrder).forEach((w, i) => {
      initial[w] = { x: i * 120, y: i * 80 };
    });
    return initial;
  });

  // Keep positions state in sync when new widgets are introduced
  useEffect(() => {
    setWidgetPositions((prev) => {
      const next = { ...prev };
      widgets.forEach((w, i) => {
        if (!next[w]) {
          next[w] = { x: i * 120, y: i * 80 };
        }
      });
      return next;
    });
  }, [widgets]);

  const handleDropPosition = (id, coords) => {
    hasUserMovedWidget.current = true;
    setWidgetPositions((prev) => ({
      ...prev,
      [id]: coords,
    }));
  };

  // refs to collect DOM nodes in grid layout
  const widgetRefs = useRef({});
  const gridContainerRef = useRef(null);
  const dropZoneRef = useRef(null);

  // ref to temporarily store captured absolute positions when switching to list
  const capturedGridPositions = useRef(null);

  const toggleLayout = () => {
    if (layoutMode === "grid") {
      const savedLayoutRaw =
        typeof window !== "undefined" &&
        localStorage.getItem("crmFreeformLayout");

      if (savedLayoutRaw) {
        const savedLayout = JSON.parse(savedLayoutRaw);
        setWidgets(savedLayout.order);
        setWidgetPositions(savedLayout.positions);
        capturedGridPositions.current = null;
      } else {
        const positions = {};
        Object.entries(widgetRefs.current).forEach(([id, el]) => {
          if (el) {
            const rect = el.getBoundingClientRect();
            positions[id] = { x: rect.left, y: rect.top };
          }
        });
        capturedGridPositions.current = positions;
      }
      setLayoutMode("list");
    } else {
      setLayoutMode("grid");
    }
  };

  // After freeform layout mounts, translate captured positions relative to drop zone
  useLayoutEffect(() => {
    if (
      layoutMode === "list" &&
      capturedGridPositions.current &&
      dropZoneRef.current
    ) {
      const dzRect = dropZoneRef.current.getBoundingClientRect();
      const newPositions = {};
      Object.entries(capturedGridPositions.current).forEach(([id, pos]) => {
        newPositions[id] = {
          x: pos.x - dzRect.left,
          y: pos.y - dzRect.top,
        };
      });
      setWidgetPositions(newPositions);
      capturedGridPositions.current = null;
    }
  }, [layoutMode]);

  // Helper to reorder widgets given a source and destination id (destination
  // may be undefined when dropping onto the free-form zone).
  const reorderWidgets = (sourceId, destinationId) => {
    hasUserMovedWidget.current = true;
    setWidgets((prev) => {
      // clone current order
      const newOrder = [...prev];

      const sourceIdx = newOrder.indexOf(sourceId);

      if (sourceIdx === -1) return prev;

      if (!destinationId) {
        // blank area: keep order, we don't change positions array below
        return newOrder;
      }

      const destIdx = newOrder.indexOf(destinationId);

      if (destIdx === -1) return newOrder;

      // Swap indices
      [newOrder[sourceIdx], newOrder[destIdx]] = [
        newOrder[destIdx],
        newOrder[sourceIdx],
      ];

      // Swap positions between source and destination so they trade places
      if (destinationId) {
        setWidgetPositions((pos) => {
          const srcPos = pos[sourceId];
          const destPos = pos[destinationId];
          if (!srcPos || !destPos) return pos;
          return {
            ...pos,
            [sourceId]: destPos,
            [destinationId]: srcPos,
          };
        });
      }

      return newOrder;
    });
  };

  // Persist layout whenever order or positions change, and on page unload
  useEffect(() => {
    const save = () => {
      if (!hasUserMovedWidget.current) return;
      localStorage.setItem(
        "crmFreeformLayout",
        JSON.stringify({ order: widgets, positions: widgetPositions })
      );
    };

    if (layoutMode === "list") save();
    window.addEventListener("beforeunload", save);
    return () => window.removeEventListener("beforeunload", save);
  }, [widgets, widgetPositions, layoutMode]);

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
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Button variant='contained' color='primary' onClick={toggleLayout}>
              switch to {layoutMode === "grid" ? "Freeform" : "Grid View"}{" "}
              Layout
            </Button>
            {layoutMode === "list" && (
              <Button
                sx={{ ml: 2 }}
                variant='outlined'
                color='secondary'
                onClick={() => {
                  hasUserMovedWidget.current = true;
                  const payload = {
                    order: widgets,
                    positions: widgetPositions,
                  };
                  localStorage.setItem(
                    "crmFreeformLayout",
                    JSON.stringify(payload)
                  );
                }}
              >
                Save Layout
              </Button>
            )}
          </Box>
          {layoutMode === "grid" ? (
            <DashBoardGrid>
              <Box display='flex' width='100%' gap={2}>
                <Box flexGrow={1} ref={gridContainerRef}>
                  <Grid container spacing={3}>
                    <Grid
                      size={4}
                      item
                      ref={(el) => (widgetRefs.current["caseStats"] = el)}
                    >
                      {widgetMap.caseStats}
                    </Grid>
                    <Grid size={4} item>
                      <div
                        ref={(el) => (widgetRefs.current["pendingCases"] = el)}
                      >
                        {widgetMap.pendingCases}
                      </div>
                    </Grid>
                    <Grid size={4} item>
                      <div
                        ref={(el) =>
                          (widgetRefs.current["activeCasesCard"] = el)
                        }
                      >
                        {widgetMap.activeCasesCard}
                      </div>
                    </Grid>
                    <Grid size={8} item>
                      <div ref={(el) => (widgetRefs.current["chart"] = el)}>
                        {widgetMap.chart}
                      </div>
                    </Grid>
                    <Grid size={4} item>
                      <div
                        ref={(el) =>
                          (widgetRefs.current["progressOverviewCard"] = el)
                        }
                      >
                        {widgetMap.progressOverviewCard}
                      </div>
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    mt: { xs: 4, md: 0 },
                    pl: 2,
                  }}
                >
                  <div ref={(el) => (widgetRefs.current["caseList"] = el)}>
                    {widgetMap.caseList}
                  </div>
                </Box>
              </Box>
            </DashBoardGrid>
          ) : (
            <DashboardDropZone
              ref={dropZoneRef}
              onReorderWidgets={setWidgets}
              onDropPosition={handleDropPosition}
            >
              <Box
                sx={{
                  backgroundImage:
                    "linear-gradient(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                  position: "relative",
                  minHeight: "100vh",
                  width: "87vw",
                  // maxWidth: "87vw",
                  display: "flex",
                  flexWrap: "row",
                  gap: 2,
                  padding: 2,
                }}
              >
                {widgets.map((widget, i) => (
                  <Box
                    key={`k-${widget}-${i}`}
                    sx={{
                      position: "absolute",
                      left: `${widgetPositions[widget]?.x ?? i * 100}px`,
                      top: `${widgetPositions[widget]?.y ?? i * 100}px`,
                      // transform: "left 0.2s ease, top 0.2s ease",
                      // width: "100vw",
                      // height: "100vh",
                    }}
                  >
                    <InteractiveWidget
                      id={widget}
                      key={widget}
                      onDragStart={(id) => setDraggedId(id)}
                      onDragEnter={(id) => setDragOverId(id)}
                      onDragLeave={() => setDragOverId(null)}
                      onDropTarget={(destId) =>
                        reorderWidgets(draggedId, destId)
                      }
                      dragOverId={dragOverId}
                    >
                      {widgetMap[widget]}
                    </InteractiveWidget>
                  </Box>
                ))}
              </Box>
            </DashboardDropZone>
          )}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

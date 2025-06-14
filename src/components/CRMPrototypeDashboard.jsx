import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  cloneElement,
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

const generateYearlyData = (min, max) => {
  return Array.from(
    { length: 12 },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
};

export default function CRMPrototypeDashboard() {
  const caseData = useMemo(() => generateRandomCases(10), []);

  const chartData = useMemo(() => {
    return {
      scans: generateYearlyData(10, 25),
      molds: generateYearlyData(8, 20),
      impressions: generateYearlyData(5, 18),
    };
  }, []);

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
  let persistedSizes = null;
  try {
    const raw =
      typeof window !== "undefined" &&
      localStorage.getItem("crmFreeformLayout");
    if (raw) {
      const parsed = JSON.parse(raw);
      persistedOrder = parsed?.order;
      persistedPositions = parsed?.positions;
      persistedSizes = parsed?.sizes;
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
    chart: <Chart chartData={chartData} />,
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

  const [widgetSizes, setWidgetSizes] = useState(() => {
    if (persistedSizes) return persistedSizes;
    const initial = {};
    (persistedOrder ?? defaultOrder).forEach((id) => {
      if (id === "chart") initial[id] = { width: 600, height: 350 };
      else if (id === "caseList") initial[id] = { width: 450, height: 400 };
      else initial[id] = { width: 320, height: 280 };
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

  const handleLayoutChange = ({ id, position, size }) => {
    hasUserMovedWidget.current = true;

    // Create mutable copies of the current state
    const newPositions = { ...widgetPositions };
    const newSizes = { ...widgetSizes };

    const dropZoneBounds = dropZoneRef.current?.getBoundingClientRect();

    // 1. Apply and clamp the incoming change (either position or size)
    if (size) {
      let newWidth = Math.max(200, size.width);
      let newHeight = Math.max(150, size.height);

      if (dropZoneBounds) {
        const currentPos = newPositions[id];
        newWidth = Math.min(newWidth, dropZoneBounds.width - currentPos.x);
        newHeight = Math.min(newHeight, dropZoneBounds.height - currentPos.y);
      }
      newSizes[id] = { width: newWidth, height: newHeight };
    }

    if (position) {
      let newX = position.x;
      let newY = position.y;

      if (dropZoneBounds) {
        const currentSize = newSizes[id];
        newX = Math.max(
          0,
          Math.min(newX, dropZoneBounds.width - currentSize.width)
        );
        newY = Math.max(
          0,
          Math.min(newY, dropZoneBounds.height - currentSize.height)
        );
      }
      newPositions[id] = { x: newX, y: newY };
    }

    // 2. Resolve collisions caused by the change
    const mainWidgetRect = { ...newPositions[id], ...newSizes[id] };
    const gap = 15;

    widgets.forEach((otherId) => {
      if (id === otherId) return;

      const otherWidgetRect = {
        ...newPositions[otherId],
        ...newSizes[otherId],
      };

      const isOverlapping =
        mainWidgetRect.x < otherWidgetRect.x + otherWidgetRect.width &&
        mainWidgetRect.x + mainWidgetRect.width > otherWidgetRect.x &&
        mainWidgetRect.y < otherWidgetRect.y + otherWidgetRect.height &&
        mainWidgetRect.y + mainWidgetRect.height > otherWidgetRect.y;

      if (isOverlapping) {
        // Push the other widget down
        let pushedY = mainWidgetRect.y + mainWidgetRect.height + gap;
        if (dropZoneBounds) {
          pushedY = Math.min(
            pushedY,
            dropZoneBounds.height - newSizes[otherId].height
          );
        }
        newPositions[otherId].y = pushedY;
      }
    });

    // 3. Commit the new state
    setWidgetPositions(newPositions);
    setWidgetSizes(newSizes);
  };

  const handleDropPosition = (id, coords) => {
    handleLayoutChange({ id, position: coords });
  };

  const handleResize = (id, newSize) => {
    handleLayoutChange({ id, size: newSize });
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
        JSON.stringify({
          order: widgets,
          positions: widgetPositions,
          sizes: widgetSizes,
        })
      );
    };

    if (layoutMode === "list") save();
    window.addEventListener("beforeunload", save);
    return () => window.removeEventListener("beforeunload", save);
  }, [widgets, widgetPositions, widgetSizes, layoutMode]);

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
          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "flex" },
              justifyContent: "flex-end",
              p: 2,
            }}
          >
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
                    sizes: widgetSizes,
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
              <Box
                display='flex'
                width='100%'
                gap={2}
                sx={{
                  flexDirection: { xs: "column", sm: "column", md: "row" },
                }}
              >
                <Box flexGrow={1} ref={gridContainerRef}>
                  <Grid container spacing={3}>
                    <Grid
                      size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}
                      ref={(el) => (widgetRefs.current["caseStats"] = el)}
                    >
                      {widgetMap.caseStats}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                      <div
                        ref={(el) => (widgetRefs.current["pendingCases"] = el)}
                      >
                        {widgetMap.pendingCases}
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                      <div
                        ref={(el) =>
                          (widgetRefs.current["activeCasesCard"] = el)
                        }
                      >
                        {widgetMap.activeCasesCard}
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }}>
                      <div ref={(el) => (widgetRefs.current["chart"] = el)}>
                        {widgetMap.chart}
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
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
                    width: { xs: "100%", sm: "100%", md: "50%" },
                    mt: { xs: 4, sm: 4, md: 0 },
                    pl: { xs: 0, sm: 0, md: 2 },
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
                {widgets.map((widget) => (
                  <InteractiveWidget
                    id={widget}
                    key={widget}
                    position={widgetPositions[widget]}
                    size={widgetSizes[widget]}
                    onDragStart={(id) => setDraggedId(id)}
                    onDragEnter={(id) => setDragOverId(id)}
                    onDragLeave={() => setDragOverId(null)}
                    onDropTarget={(destId) => reorderWidgets(draggedId, destId)}
                    dragOverId={dragOverId}
                    onResize={handleResize}
                  >
                    {cloneElement(widgetMap[widget], { isFreeform: true })}
                  </InteractiveWidget>
                ))}
              </Box>
            </DashboardDropZone>
          )}
        </Box>
        <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  cloneElement,
} from "react";
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
import useDashboardData from "../hooks/useDashboardData";
import DashboardDropZone from "./layout/DashBoardDropZone";
import InteractiveWidget from "./layout/InteractiveWidget";
import WidgetStore from "./widgets/WidgetStore";
import LayoutToolbar from "./LayoutToolbar";
import useWidgetLayout from "../hooks/useWidgetLayout";

export default function CRMPrototypeDashboard() {
  const { caseData, chartData, stats } = useDashboardData(10);

  const defaultOrder = [
    "caseStats",
    "pendingCases",
    "activeCasesCard",
    "chart",
    "progressOverviewCard",
    "caseList",
  ];

  const {
    widgets,
    setWidgets,
    widgetPositions,
    setWidgetPositions,
    widgetSizes,
    setWidgetSizes,
    addWidget,
    removeWidget,
    saveLayout,
    hasUserMovedRef,
    handleLayoutChange: applyLayoutChange,
    findFreeSpace: calcFreeSpace,
    reorderWidgets,
  } = useWidgetLayout(defaultOrder);

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
  const [isLocked, setIsLocked] = useState(false);
  const [isWidgetStoreOpen, setWidgetStoreOpen] = useState(false);

  const allWidgetIds = useMemo(() => Object.keys(widgetMap), []);
  const availableWidgets = useMemo(
    () => allWidgetIds.filter((id) => !widgets.includes(id)),
    [allWidgetIds, widgets]
  );

  const handleLayoutChange = (args) =>
    applyLayoutChange(args, dropZoneRef.current?.getBoundingClientRect());

  const findFreeSpace = (widgetSize) =>
    calcFreeSpace(widgetSize, dropZoneRef.current);

  const handleAddWidget = (widgetId) => {
    const defaultSizes = {
      chart: { width: 600, height: 350 },
      caseList: { width: 450, height: 400 },
    };
    const newWidgetSize = defaultSizes[widgetId] || { width: 320, height: 280 };

    const position = findFreeSpace(newWidgetSize);

    addWidget(widgetId, position, newWidgetSize);
    setWidgetStoreOpen(false);
  };

  const handleRemoveWidget = (widgetId) => {
    removeWidget(widgetId);
    // Note: position and size data can remain, will be overwritten if widget is re-added
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

  const toggleLock = () => {
    setIsLocked((prev) => !prev);
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

  // Persist layout whenever order or positions change, and on page unload
  useEffect(() => {
    const save = () => saveLayout();

    if (layoutMode === "list") save();
    window.addEventListener("beforeunload", save);
    return () => window.removeEventListener("beforeunload", save);
  }, [widgets, widgetPositions, widgetSizes, layoutMode, saveLayout]);

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
            <LayoutToolbar
              layoutMode={layoutMode}
              isLocked={isLocked}
              onToggleLayout={toggleLayout}
              onToggleLock={toggleLock}
              onSaveLayout={() => {
                saveLayout();
              }}
              onAddWidget={() => setWidgetStoreOpen(true)}
            />
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
                    onDropTarget={
                      isLocked
                        ? undefined
                        : (destId) => reorderWidgets(draggedId, destId)
                    }
                    dragOverId={dragOverId}
                    onResize={handleResize}
                    onRemove={isLocked ? undefined : handleRemoveWidget}
                    isLocked={isLocked}
                    scaleWith={
                      widget === "caseList" ? "width-shrink" : "average"
                    }
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
      <WidgetStore
        isOpen={isWidgetStoreOpen}
        onClose={() => setWidgetStoreOpen(false)}
        availableWidgets={availableWidgets}
        onAddWidget={handleAddWidget}
      />
    </Box>
  );
}

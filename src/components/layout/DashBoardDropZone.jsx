// layout/DashboardDropZone.jsx
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import React, { useEffect, useRef } from "react";

export default function DashboardDropZone({ children, onReorderWidgets }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const cleanup = dropTargetForElements({
      element: ref.current,
      getData: () => ({ type: "dashboard-zone" }),
      onDrop: ({ source }) => {
        if (!source?.data?.id) return;
        onReorderWidgets((prev) => {
          const newOrder = prev.filter((widget) => widget !== source.data.id);
          newOrder.push(source.data.id);
          return newOrder;
        });
      },
    });

    return () => cleanup();
  }, [onReorderWidgets]);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      {children}
    </div>
  );
}

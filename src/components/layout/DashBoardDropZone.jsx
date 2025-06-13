// layout/DashboardDropZone.jsx
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import React, { useEffect, useRef, useState } from "react";

export default function DashboardDropZone({ children, onReorderWidgets }) {
  const ref = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const cleanup = dropTargetForElements({
      element: ref.current,
      getData: () => ({ type: "dashboard-zone" }),
      onDragEnter: () => setIsDragging(true),
      onDragLeave: () => setIsDragging(false),
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
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        border: isDragging ? "2px dashed #2196f3" : "2px dashed transparent",
        transition: "border 0.2s ease-in-out",
        borderRadius: 8,
      }}
    >
      {children}
    </div>
  );
}

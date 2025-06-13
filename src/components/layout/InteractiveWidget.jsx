import React, { useEffect, useRef } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export default function InteractiveWidget({
  id,
  dragOverId,
  children,
  onDragEnter,
  onDragLeave,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return; // 🛑 Avoid undefined error

    // ✅ register draggable
    const cleanupDraggable = draggable({
      element: ref.current,
      getInitialData: () => ({ type: "widget", id }),
    });

    // ✅ register drop target
    const cleanupDropTarget = dropTargetForElements({
      element: ref.current,
      getData: () => ({ type: "widget", id }),
      onDragEnter: () => onDragEnter?.(id),
      onDragLeave: () => onDragLeave?.(id),
      onDrop: ({ source }) => {
        console.log(`Dropped ${source.data.id} onto ${id}`);
      },
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [id, onDragEnter, onDragLeave]);

  return (
    <div
      ref={ref}
      style={{
        border:
          dragOverId === id ? "2px dashed #2196f3" : "2px dashed transparent",
        transition: "border 0.2s ease-in-out",
        borderRadius: "4px",
      }}
    >
      {children}
    </div>
  );
}

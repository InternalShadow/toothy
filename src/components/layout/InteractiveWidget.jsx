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
  onDropTarget,
  onDragStart,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return; // 🛑 Avoid undefined error

    // ✅ register draggable
    const cleanupDraggable = draggable({
      element: ref.current,
      getInitialData: () => ({ type: "widget", id }),
      onDragStart: () => {
        // Temporarily disable pointer events so that the underlying drop
        // zone (or other widgets) can properly receive the drag over / drop
        // callbacks. This enables free-form dropping inside the dashboard.
        if (ref.current) {
          ref.current.style.pointerEvents = "none";
        }

        onDragStart?.(id);
      },
      onDrop: () => {
        if (ref.current) ref.current.style.pointerEvents = "auto";
      },
    });

    // ✅ register drop target
    const cleanupDropTarget = dropTargetForElements({
      element: ref.current,
      getData: () => ({ type: "widget", id }),
      onDragEnter: () => onDragEnter?.(id),
      onDragLeave: () => onDragLeave?.(id),
      onDrop: ({ source }) => {
        console.log(`Dropped ${source.data.id} onto ${id}`);
        onDropTarget?.(id);
      },
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [id, onDragEnter, onDragLeave, onDropTarget, onDragStart]);

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

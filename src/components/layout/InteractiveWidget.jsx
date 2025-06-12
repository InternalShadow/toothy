import React, { useEffect, useRef } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export default function InteractiveWidget({ id, children }) {
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
      onDrop: ({ source }) => {
        console.log(`Dropped ${source.data.id} onto ${id}`);
      },
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [id]);

  return <div ref={ref}>{children}</div>;
}

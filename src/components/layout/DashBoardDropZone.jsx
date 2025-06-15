// layout/DashboardDropZone.jsx
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

const DashboardDropZone = forwardRef(function DashboardDropZone(
  { children, onReorderWidgets, onDropPosition },
  refForward
) {
  const ref = useRef(null);
  // allow outer components to access underlying element
  useImperativeHandle(refForward, () => ref.current);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const cleanup = dropTargetForElements({
      element: ref.current,
      getData: () => ({ type: "dashboard-zone" }),
      onDragEnter: () => setIsDragging(true),
      onDragLeave: () => setIsDragging(false),
      onDrop: ({ source, location }) => {
        if (!source?.data?.id) return;

        // Calculate coordinates relative to the drop zone for free placement.
        const rect = ref.current.getBoundingClientRect();
        const { clientX: pointerX, clientY: pointerY } = location.current.input;

        // Get offset from dragged data, fallback to centering.
        const { offsetX, offsetY } = source.data;
        const draggedRect = source.element?.getBoundingClientRect();
        const fallbackX = draggedRect ? draggedRect.width / 2 : 0;
        const fallbackY = draggedRect ? draggedRect.height / 2 : 0;

        let x = pointerX - rect.left - (offsetX ?? fallbackX);
        let y = pointerY - rect.top - (offsetY ?? fallbackY);

        // Clamp to stay within drop zone bounds
        const maxX = rect.width - (draggedRect?.width ?? 0);
        const maxY = rect.height - (draggedRect?.height ?? 0);
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        onDropPosition?.(source.data.id, { x, y });

        // Maintain ordering by moving the dragged widget to the end unless the
        // consumer overrides this behavior in the onDropPosition handler.
        onReorderWidgets?.((prev) => {
          const newOrder = prev.filter((widget) => widget !== source.data.id);
          newOrder.push(source.data.id);
          return newOrder;
        });
      },
    });

    return () => cleanup();
  }, [onReorderWidgets, onDropPosition]);

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
});

export default DashboardDropZone;

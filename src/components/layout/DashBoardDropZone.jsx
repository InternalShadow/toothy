// layout/DashboardDropZone.jsx
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

const GRID_SIZE = 16;
const AUTO_SCROLL_THRESHOLD = 80;
const AUTO_SCROLL_STEP = 30;

const DashboardDropZone = forwardRef(function DashboardDropZone(
  { children, onReorderWidgets, onDropPosition },
  refForward
) {
  const ref = useRef(null);
  // allow outer components to access underlying element
  useImperativeHandle(refForward, () => ref.current);

  const [isDragging, setIsDragging] = useState(false);
  const [placeholder, setPlaceholder] = useState(null);

  useEffect(() => {
    if (!ref.current) return;

    const cleanupDnd = dropTargetForElements({
      element: ref.current,
      getData: () => ({ type: "dashboard-zone" }),
      onDragEnter: () => setIsDragging(true),
      onDragLeave: () => {
        setIsDragging(false);
        setPlaceholder(null);
      },
      onDrag: ({ source, location }) => {
        const dzRect = ref.current?.getBoundingClientRect();
        if (!dzRect) return;

        const draggedRect = source.element.getBoundingClientRect();
        const {
          offsetX = draggedRect.width / 2,
          offsetY = draggedRect.height / 2,
        } = source.data;

        let x = location.current.input.clientX - dzRect.left - offsetX;
        let y = location.current.input.clientY - dzRect.top - offsetY;

        // Snap to grid
        x = Math.round(x / GRID_SIZE) * GRID_SIZE;
        y = Math.round(y / GRID_SIZE) * GRID_SIZE;

        // Clamp
        const maxX = dzRect.width - draggedRect.width;
        const maxY = dzRect.height - draggedRect.height;
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        setPlaceholder({
          x,
          y,
          width: draggedRect.width,
          height: draggedRect.height,
        });

        // Auto-scroll
        const { clientX, clientY } = location.current.input;
        if (clientX < AUTO_SCROLL_THRESHOLD) {
          window.scrollBy({ left: -AUTO_SCROLL_STEP, behavior: "smooth" });
        } else if (clientX > window.innerWidth - AUTO_SCROLL_THRESHOLD) {
          window.scrollBy({ left: AUTO_SCROLL_STEP, behavior: "smooth" });
        }
        if (clientY < AUTO_SCROLL_THRESHOLD) {
          window.scrollBy({ top: -AUTO_SCROLL_STEP, behavior: "smooth" });
        } else if (clientY > window.innerHeight - AUTO_SCROLL_THRESHOLD) {
          window.scrollBy({ top: AUTO_SCROLL_STEP, behavior: "smooth" });
        }
      },
      onDrop: ({ source, location }) => {
        setIsDragging(false);
        setPlaceholder(null);

        if (!source?.data?.id) return;

        // Calculate coordinates relative to the drop zone for free placement.
        const rect = ref.current.getBoundingClientRect();
        const { clientX: pointerX, clientY: pointerY } = location.current.input;

        // Get offset from dragged data, fallback to centering.
        const { offsetX, offsetY } = source.data;
        const draggedRect = source.element?.getBoundingClientRect();

        let x =
          pointerX - rect.left - (offsetX ?? (draggedRect?.width ?? 0) / 2);
        let y =
          pointerY - rect.top - (offsetY ?? (draggedRect?.height ?? 0) / 2);

        // Final snap
        x = Math.round(x / GRID_SIZE) * GRID_SIZE;
        y = Math.round(y / GRID_SIZE) * GRID_SIZE;

        // Final clamp
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

    return () => cleanupDnd();
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
        position: "relative", // Needed for placeholder positioning
      }}
    >
      {children}
      {placeholder && (
        <div
          style={{
            position: "absolute",
            left: placeholder.x,
            top: placeholder.y,
            width: placeholder.width,
            height: placeholder.height,
            border: "2px dashed #42a5f5",
            borderRadius: 8,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
});

export default DashboardDropZone;

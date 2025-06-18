import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook that encapsulates all state related to dashboard widgets in the
 * free-form layout: order, absolute positions, sizes and persistence.
 */
export default function useWidgetLayout(
  defaultOrder,
  storageKey = "crmFreeformLayout"
) {
  // --- load persisted layout --------------------------------------------
  let persistedOrder = null;
  let persistedPositions = null;
  let persistedSizes = null;
  try {
    const raw =
      typeof window !== "undefined" && localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      persistedOrder = parsed?.order;
      persistedPositions = parsed?.positions;
      persistedSizes = parsed?.sizes;
    }
  } catch (_) {
    /* ignore corrupt data */
  }

  // ----------------------------------------------------------------------
  const [widgets, setWidgets] = useState(persistedOrder ?? defaultOrder);

  // Absolute x/y positions
  const [widgetPositions, setWidgetPositions] = useState(() => {
    if (persistedPositions) return persistedPositions;
    const initial = {};
    (persistedOrder ?? defaultOrder).forEach((w, i) => {
      initial[w] = { x: i * 120, y: i * 80 };
    });
    return initial;
  });

  // Width/height
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

  // Track whether the user has made changes (to avoid saving untouched state)
  const hasUserMovedRef = useRef(false);

  // Keep positions object in sync when new widgets are introduced ---------
  useEffect(() => {
    setWidgetPositions((prev) => {
      const next = { ...prev };
      widgets.forEach((w, i) => {
        if (!next[w]) next[w] = { x: i * 120, y: i * 80 };
      });
      return next;
    });
  }, [widgets]);

  // ----------------------------------------------------------------------
  const addWidget = (widgetId, position, size) => {
    hasUserMovedRef.current = true;
    setWidgets((prev) => [...prev, widgetId]);
    if (position)
      setWidgetPositions((prev) => ({ ...prev, [widgetId]: position }));
    if (size) setWidgetSizes((prev) => ({ ...prev, [widgetId]: size }));
  };

  const removeWidget = (widgetId) => {
    hasUserMovedRef.current = true;
    setWidgets((prev) => prev.filter((id) => id !== widgetId));
  };

  const saveLayout = useCallback(() => {
    if (!hasUserMovedRef.current) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          order: widgets,
          positions: widgetPositions,
          sizes: widgetSizes,
        })
      );
    } catch (_) {
      /* ignore */
    }
  }, [storageKey, widgets, widgetPositions, widgetSizes]);

  return {
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
    /**
     * Apply a position and/or size change for a widget, handling clamping and
     * simple collision-resolution. `dropZoneBounds` is an optional DOMRect of
     * the free-form canvas so we can respect its edges.
     */
    handleLayoutChange: ({ id, position, size }, dropZoneBounds) => {
      hasUserMovedRef.current = true;

      setWidgetPositions((prevPos) => {
        const newPositions = { ...prevPos };
        const newSizes = { ...widgetSizes };

        // ----- apply incoming size -----------------
        if (size) {
          let newWidth = Math.max(200, size.width);
          let newHeight = Math.max(150, size.height);

          if (dropZoneBounds) {
            const currentPos = newPositions[id];
            newWidth = Math.min(newWidth, dropZoneBounds.width - currentPos.x);
            newHeight = Math.min(
              newHeight,
              dropZoneBounds.height - currentPos.y
            );
          }
          newSizes[id] = { width: newWidth, height: newHeight };
        }

        // ----- apply incoming position -------------
        if (position) {
          let newX = position.x;
          let newY = position.y;

          if (dropZoneBounds) {
            const currentSize = newSizes[id] ?? widgetSizes[id];
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

        // ----- collision resolution ----------------
        const mainRect = { ...newPositions[id], ...newSizes[id] };
        const gap = 15;

        widgets.forEach((otherId) => {
          if (id === otherId) return;

          const r = {
            ...newPositions[otherId],
            ...(newSizes[otherId] ?? widgetSizes[otherId]),
          };
          const overlap =
            mainRect.x < r.x + r.width &&
            mainRect.x + mainRect.width > r.x &&
            mainRect.y < r.y + r.height &&
            mainRect.y + mainRect.height > r.y;

          if (overlap) {
            let pushedY = mainRect.y + mainRect.height + gap;
            if (dropZoneBounds) {
              pushedY = Math.min(pushedY, dropZoneBounds.height - r.height);
            }
            newPositions[otherId] = { ...newPositions[otherId], y: pushedY };
          }
        });

        // Commit sizes (using setter separately to avoid stale closure)
        setWidgetSizes((prev) => ({ ...prev, ...newSizes }));
        return newPositions;
      });
    },

    /**
     * Return x/y coordinates for a new widget that do not overlap existing ones.
     * Requires dropZone element to measure available space.
     */
    findFreeSpace: (widgetSize, dropZoneEl) => {
      if (!dropZoneEl) return { x: 0, y: 0 };
      const dropZoneWidth = dropZoneEl.offsetWidth;
      const dropZoneHeight = dropZoneEl.offsetHeight;
      const existingRects = widgets.map((id) => ({
        ...widgetPositions[id],
        ...widgetSizes[id],
      }));
      const gap = 15;
      const step = 40;

      for (let y = 0; y <= dropZoneHeight - widgetSize.height; y += step) {
        for (let x = 0; x <= dropZoneWidth - widgetSize.width; x += step) {
          const rect = {
            x,
            y,
            width: widgetSize.width,
            height: widgetSize.height,
          };
          const hasOverlap = existingRects.some(
            (r) =>
              rect.x < r.x + r.width + gap &&
              rect.x + rect.width + gap > r.x &&
              rect.y < r.y + r.height + gap &&
              rect.y + rect.height + gap > r.y
          );
          if (!hasOverlap) return { x, y };
        }
      }
      // fallback: stack at bottom
      const yFallback = Math.max(
        ...existingRects.map((r) => r.y + r.height + gap),
        0
      );
      return { x: 0, y: yFallback };
    },

    /** Swap widget order and optionally trade positions */
    reorderWidgets: (sourceId, destinationId) => {
      hasUserMovedRef.current = true;
      setWidgets((prev) => {
        const newOrder = [...prev];
        const srcIdx = newOrder.indexOf(sourceId);
        if (srcIdx === -1) return prev;

        if (!destinationId) return newOrder; // dropped on blank canvas

        const destIdx = newOrder.indexOf(destinationId);
        if (destIdx === -1) return newOrder;

        [newOrder[srcIdx], newOrder[destIdx]] = [
          newOrder[destIdx],
          newOrder[srcIdx],
        ];

        // swap positions
        setWidgetPositions((pos) => {
          const srcPos = pos[sourceId];
          const destPos = pos[destinationId];
          if (!srcPos || !destPos) return pos;
          return { ...pos, [sourceId]: destPos, [destinationId]: srcPos };
        });

        return newOrder;
      });
    },
  };
}

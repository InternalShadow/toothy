import React, { useEffect, useRef, useState } from "react";
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
  position,
  size,
  onResize,
  onRemove,
  scaleWith = "average",
  isLocked = false,
}) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  const isFreeform = !!position;
  const isInteractive = isFreeform && !isLocked;

  useEffect(() => {
    if (!ref.current || !isInteractive) return;

    const cleanupDraggable = draggable({
      element: ref.current,
      getInitialData: (args) => {
        const rect = ref.current.getBoundingClientRect();
        const offsetX = args.input.clientX - rect.left;
        const offsetY = args.input.clientY - rect.top;
        return { type: "widget", id, offsetX, offsetY };
      },
      onDragStart: () => {
        if (ref.current) ref.current.style.pointerEvents = "none";
        onDragStart?.(id);
      },
      onDrop: () => {
        if (ref.current) ref.current.style.pointerEvents = "auto";
      },
    });

    const cleanupDropTarget = dropTargetForElements({
      element: ref.current,
      getData: () => ({ type: "widget", id }),
      onDragEnter: () => onDragEnter?.(id),
      onDragLeave: () => onDragLeave?.(id),
      onDrop: ({ source }) => onDropTarget?.(source.data.id, id),
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [id, onDragEnter, onDragLeave, onDropTarget, onDragStart, isInteractive]);

  useEffect(() => {
    const observerTarget = ref.current;
    if (!observerTarget || !isFreeform) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const baseDimension = 400; // baseline dimension

        let newScale = 1;
        switch (scaleWith) {
          case "width": {
            newScale = Math.max(0.5, Math.min(2, width / baseDimension));
            break;
          }
          case "width-shrink": {
            newScale = Math.max(0.5, Math.min(1, width / baseDimension));
            break;
          }
          case "height": {
            newScale = Math.max(0.5, Math.min(2, height / baseDimension));
            break;
          }
          case "none": {
            newScale = 1;
            break;
          }
          case "average":
          default: {
            const currentDimension = (width + height) / 2;
            newScale = Math.max(
              0.5,
              Math.min(2, currentDimension / baseDimension)
            );
          }
        }
        setScale(newScale);
      }
    });

    resizeObserver.observe(observerTarget);

    return () => resizeObserver.unobserve(observerTarget);
  }, [size, isFreeform, scaleWith]);

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const doResize = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      const newHeight = startHeight + (moveEvent.clientY - startY);
      onResize(id, { width: newWidth, height: newHeight });
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
    };

    window.addEventListener("mousemove", doResize);
    window.addEventListener("mouseup", stopResize);
  };

  return (
    <div
      ref={ref}
      style={{
        position: isFreeform ? "absolute" : "relative",
        left: isFreeform ? `${position.x}px` : "auto",
        top: isFreeform ? `${position.y}px` : "auto",
        width: isFreeform ? `${size.width}px` : "100%",
        height: isFreeform ? `${size.height}px` : "100%",
        boxSizing: "border-box",
        transition: "box-shadow 0.2s, border-color 0.2s",
        borderRadius: "8px",
        border:
          dragOverId === id ? "2px dashed #2196f3" : "2px solid transparent",
        boxShadow: isFreeform
          ? "0 4px 8px rgba(0,0,0,0.1), 0 6px 20px rgba(0,0,0,0.1)"
          : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: "inherit", // Match parent's border radius
        }}
      >
        <div
          style={{
            width: isFreeform
              ? `${scaleWith === "none" ? 100 : 100 / scale}%`
              : "100%",
            height: isFreeform
              ? `${scaleWith === "none" ? 100 : 100 / scale}%`
              : "100%",
            transform:
              isFreeform && scaleWith !== "none" ? `scale(${scale})` : "none",
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
      {isInteractive && onRemove && (
        <button
          onClick={() => onRemove(id)}
          style={{
            position: "absolute",
            top: "-6px",
            right: "-10px",
            width: "10px",
            height: "10px",
            background: "#fff",
            color: "#333",
            border: "1px solid #ddd",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            fontSize: "14px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
          }}
          aria-label={`Remove widget ${id}`}
        >
          &#x2715;
        </button>
      )}
      {isInteractive && (
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "20px",
            height: "20px",
            cursor: "se-resize",
            zIndex: 10,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{ display: "block" }}
          >
            <path
              d='M15 1L1 15'
              stroke='#42a5f5'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <path
              d='M15 6L6 15'
              stroke='#42a5f5'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <path
              d='M15 11L11 15'
              stroke='#42a5f5'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        </div>
      )}
    </div>
  );
}

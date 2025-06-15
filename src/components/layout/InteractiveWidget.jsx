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
}) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  const isFreeform = !!position;

  useEffect(() => {
    if (!ref.current || !isFreeform) return;

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
  }, [id, onDragEnter, onDragLeave, onDropTarget, onDragStart, isFreeform]);

  useEffect(() => {
    const observerTarget = ref.current;
    if (!observerTarget || !isFreeform) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const baseWidth = 400; // A baseline width for scaling content
        const newScale = Math.max(0.5, Math.min(2, width / baseWidth));
        setScale(newScale);
      }
    });

    resizeObserver.observe(observerTarget);

    return () => resizeObserver.unobserve(observerTarget);
  }, [size, isFreeform]);

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
            width: isFreeform ? `${100 / scale}%` : "100%",
            height: isFreeform ? `${100 / scale}%` : "100%",
            transform: isFreeform ? `scale(${scale})` : "none",
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
      {isFreeform && (
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

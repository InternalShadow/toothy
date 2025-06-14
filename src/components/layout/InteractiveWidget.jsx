import React, { useEffect, useRef, useState, cloneElement } from "react";
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

  useEffect(() => {
    if (!ref.current) return;

    const cleanupDraggable = draggable({
      element: ref.current,
      getInitialData: () => ({ type: "widget", id }),
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
  }, [id, onDragEnter, onDragLeave, onDropTarget, onDragStart]);

  useEffect(() => {
    const observerTarget = ref.current;
    if (!observerTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const baseWidth = 400; // a baseline width for scaling
        const newScale = Math.max(0.5, Math.min(2, width / baseWidth));
        setScale(newScale);
      }
    });

    resizeObserver.observe(observerTarget);

    return () => resizeObserver.unobserve(observerTarget);
  }, [size]);

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
        position: "absolute",
        left: position ? `${position.x}px` : "0px",
        top: position ? `${position.y}px` : "0px",
        width: size ? `${size.width}px` : "auto",
        height: size ? `${size.height}px` : "auto",
        boxSizing: "border-box",
        transition: "border 0.2s ease-in-out",
        borderRadius: "4px",
        border:
          dragOverId === id ? "2px dashed #2196f3" : "2px dashed transparent",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${100 / scale}%`,
            height: `${100 / scale}%`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            display: "flex",
          }}
        >
          {children}
        </div>
      </div>
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
    </div>
  );
}

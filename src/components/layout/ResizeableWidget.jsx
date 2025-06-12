import React, { useState } from "react";
import { Rnd } from "react-rnd";

export default function ResizeableWidget({
  children,
  defaultPosition,
  defaultSize,
}) {
  const [canDrag, setCanDrag] = useState(false);

  return (
    <Rnd
      default={{
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: defaultSize.width,
        height: defaultSize.height,
      }}
      canDrag={canDrag}
      bounds='parent'
      style={{ zIndex: 1 }}
      onMouseEnter={() => setCanDrag(true)}
      onMouseLeave={() => setCanDrag(false)}
    >
      {children}
    </Rnd>
  );
}

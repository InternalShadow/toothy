import { Rnd } from "react-rnd";
import { Paper, Typography } from "@mui/material";

export default function ResizableDraggableWidget({
  children,
  defaultPosition,
  defaultSize,
}) {
  return (
    <Rnd
      default={{
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: defaultSize.width,
        height: defaultSize.height,
      }}
      bounds='parent'
      style={{ zIndex: 1 }}
    >
      <Paper sx={{ width: "100%", height: "100%", p: 0.5 }}>{children}</Paper>
    </Rnd>
  );
}

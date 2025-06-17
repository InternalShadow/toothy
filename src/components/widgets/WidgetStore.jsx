import React from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const widgetDisplayNames = {
  caseStats: "Case Statistics",
  pendingCases: "Pending Cases",
  activeCasesCard: "Active Cases",
  chart: "Cases Chart",
  progressOverviewCard: "Progress Overview",
  caseList: "Case List",
};

export default function WidgetStore({
  isOpen,
  onClose,
  availableWidgets,
  onAddWidget,
}) {
  return (
    <Drawer anchor='right' open={isOpen} onClose={onClose}>
      <Box sx={{ width: 250, p: 2 }} role='presentation'>
        <Typography variant='h6' component='div' sx={{ mb: 2 }}>
          Add Widgets
        </Typography>
        <Divider />
        <List>
          {availableWidgets.map((widgetId) => (
            <ListItem key={widgetId} disablePadding>
              <ListItemButton onClick={() => onAddWidget(widgetId)}>
                <ListItemIcon>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText
                  primary={widgetDisplayNames[widgetId] || widgetId}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {availableWidgets.length === 0 && (
            <ListItem>
              <ListItemText primary='All widgets are on the dashboard.' />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
}

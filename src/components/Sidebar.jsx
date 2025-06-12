import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import DescriptionIcon from "@mui/icons-material/Description";

const menuItems = [
  { text: "Main Dashboard", icon: <DashboardIcon /> },
  { text: "Manage Cases", icon: <DescriptionIcon /> },
  { text: "Manage Clients", icon: <PeopleIcon /> },
  { text: "Manage Users", icon: <SettingsIcon /> },
  { text: "Logout", icon: <LogoutIcon /> },
];
export default function Sidebar() {
  return (
    <div className='sidebar'>
      <List
        sx={{
          width: "240",
          bgcolor: "background.paper",
          height: "100vh",
          padding: "10px 0",
          boxShadow: "0 0 10px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {menuItems.map((item) => (
          <ListItemButton key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: "primary.main" }} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
}

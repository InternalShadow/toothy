import * as React from "react";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import CustomDatePicker from "../CustomDatePicker";
import NavbarBreadcrumbs from "../NavbarBreadCrumbs";
import MenuButton from "../MenuButton";
import ColorModeIconDropdown from "../../styles/shared-theme/ColorModeIconDropdown";
import InvertColorButton from "../InvertColorButton";

import Search from "../Search";

export default function Header() {
  return (
    <Stack
      direction='row'
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "100%" },
        pt: 1.5,
        bgcolor: "background.paper",
        padding: 2,
        boxShadow: 1,
        marginBottom: 2,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction='row' sx={{ gap: 1 }}>
        <Search />
        <CustomDatePicker />
        <MenuButton showBadge aria-label='Open notifications'>
          <NotificationsRoundedIcon />
        </MenuButton>
        <InvertColorButton />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}

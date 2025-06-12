import { Grid } from "@mui/material";

export default function DashBoardGrid({ children }) {
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {children}
    </Grid>
  );
}

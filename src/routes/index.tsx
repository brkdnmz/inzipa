import { GRID_SIZE } from "@/constants";
import { Box, Button } from "@mui/material";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box className="flex flex-1 items-center justify-center">
      <Link to="/play" search={GRID_SIZE}>
        <Button variant="contained" size="large">
          Oyna
        </Button>
      </Link>
    </Box>
  );
}

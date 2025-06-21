import { theme } from "@/theme";
import { Box, Container } from "@mui/material";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Box sx={{ bgcolor: theme.palette.background.default }}>
      <Container className="flex min-h-screen p-0">
        <Outlet />

        <TanStackRouterDevtools />
      </Container>
    </Box>
  );
}

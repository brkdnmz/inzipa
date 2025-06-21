import { theme } from "@/theme";
import { Container } from "@mui/material";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Container
      className="flex min-h-screen w-full p-0"
      sx={{ bgcolor: theme.palette.primary.dark }}
    >
      <Outlet />

      <TanStackRouterDevtools />
    </Container>
  );
}

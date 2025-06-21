import { GameSettingsForm } from "@/components/game-settings-form";
import { Box } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box className="flex flex-1 items-center justify-center">
      <GameSettingsForm />
    </Box>
  );
}

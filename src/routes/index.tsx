import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SplashScreen } from "@/components/splash-screen";
import { JSX, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent(): JSX.Element {
  const navigate = Route.useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate({ to: "/main/map" });
    }, 3000);
  });

  return (
    <div>
      <SplashScreen />
    </div>
  );
}

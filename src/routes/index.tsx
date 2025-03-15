import { createFileRoute } from "@tanstack/react-router";
import { SplashScreen } from "@/components/splash-screen";
import { JSX, useEffect } from "react";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

// TODO: Use `@capacitor/splash-screen` for the splash screen instead
function HomeComponent(): JSX.Element {
	const navigate = Route.useNavigate();

	useEffect(() => {
		setTimeout(() => {
			navigate({ to: "/main/map" });
		}, 500);
	});

	return (
		<div>
			<SplashScreen />
		</div>
	);
}

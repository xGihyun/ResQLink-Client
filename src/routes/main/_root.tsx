import {
	createFileRoute,
	createRootRoute,
	Outlet,
} from "@tanstack/react-router";
import { Navbar } from "../-components/navbar";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<div>
			<Outlet />
			<Navbar />
		</div>
	);
}

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { JSX } from "react";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const userSession = await context.auth.validateSession();
		if (userSession !== null) {
			throw redirect({ to: "/dashboard" });
		}
	},
});

function RouteComponent(): JSX.Element {
	return (
		<div className="h-svh content-center">
			<Outlet />
		</div>
	);
}

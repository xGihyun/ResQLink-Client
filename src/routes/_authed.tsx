import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Navbar } from "./-components/navbar";

export const Route = createFileRoute("/_authed")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const userSession = await context.auth.validateSession();
		if (!userSession) {
			throw redirect({ to: "/sign-in" });
		}

		return userSession;
	},
});

function RouteComponent() {
	return (
		<div className="h-svh content-center">
			<Navbar />
			<Outlet />
		</div>
	);
}

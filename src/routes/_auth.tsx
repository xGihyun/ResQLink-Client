import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
    component: RouteComponent,
	beforeLoad: async ({ context }) => {
		// TODO: Validate auth session
	},
});

function RouteComponent() {
	return (
		<div className="h-svh content-center">
			<Outlet />
		</div>
	);
}

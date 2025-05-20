import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Navbar } from "./-components/navbar";
import { JSX } from "react";
import { LocationTracker } from "./-components/location-tracker";
import { useUserStore } from "@/store/store.user";

export const Route = createFileRoute("/_authed")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const userSession = await context.auth.validateSession();
		if (!userSession) {
			throw redirect({ to: "/sign-in" });
		}
		const { setUser } = useUserStore.getState();
		setUser(userSession.user);

		return userSession;
	},
});

function RouteComponent(): JSX.Element {
	return (
		<div className="h-svh content-center">
			{/* <LocationTracker reporterId="a39592d0-29b8-4bd3-9b9b-99bf6df13e50" /> */}
			<Navbar />
			<Outlet />
		</div>
	);
}

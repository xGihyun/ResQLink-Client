import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { JSX } from "react";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const userSession = await context.auth.validateSession();
		if (userSession !== null) {
			throw redirect({ to: "/report" });
		}
	},
});

function RouteComponent(): JSX.Element {
	return (
		<main className="bg-primary-foreground mx-auto flex h-full max-w-md flex-col items-center justify-start px-8 py-18">
			<header className="text-primary text-center">
				<h1 className="font-playfair-display-black text-4xl">ResQLink</h1>
				<p>Stay Safe and Connected</p>
			</header>

			<Outlet />
		</main>
	);
}

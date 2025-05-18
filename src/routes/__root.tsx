import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "../styles.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient } from "@tanstack/react-query";
import { AuthContextValue } from "@/auth";

type RouterContext = {
	auth: AuthContextValue;
	queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<Outlet />
			<Toaster richColors closeButton theme="light" position="top-right" />

			{/* <TanStackRouterDevtools position="bottom-right" /> */}
		</>
	);
}

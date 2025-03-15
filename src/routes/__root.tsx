import { Outlet, createRootRoute, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "../styles.css";
import { useEffect } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import supabase from "@/lib/supabase";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { useAuthStore } from "@/store/store.auth";
import { QueryClient } from "@tanstack/react-query";
import { AuthContextValue } from "@/lib/auth";

type RouterContext = {
	auth: AuthContextValue;
	queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent
});

function RootComponent() {
	const triggerNotification = async () => {
		await LocalNotifications.schedule({
			notifications: [
				{
					title: "Test Notification",
					body: "This is a test notification triggered by a button click.",
					id: 1,
					schedule: { at: new Date(Date.now() + 1000 * 3) },
				},
			],
		});
	};

	const sendLocation = async () => {
		const auth = useAuthStore();

		if (Capacitor.getPlatform() !== "android") {
			return;
		}

		const position = await Geolocation.getCurrentPosition(); // Can't test in browser
		const lat = position.coords.latitude;
		const long = position.coords.longitude;

		await supabase.from("victim_reports").insert({
			status: "at-risk",
			raw_situation: "",
			lat: lat,
			long: long,
			user_id: auth.user.id,
		});
	};

	useEffect(() => {
		const requestPermissions = async () => {
			const result = await LocalNotifications.requestPermissions();
			if (result.display !== "granted") {
				console.log("Notification permissions denied.");
				return;
			}
			console.log("Notification permissions granted.");
		};

		requestPermissions();

		const listener = LocalNotifications.addListener(
			"localNotificationReceived",
			async (notification) => {
				// TODO: Check if it works on Android
				console.log("RECEIVED");
				if (notification.id === 1) {
					await triggerNotification();
				}
			},
		);

		const disasterChannel = supabase
			.channel("disasters")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "disasters" },
				async (payload) => {
					toast.warning(
						`Disaster Warning! Something bad is about to happen: ${payload.new.category} ${payload.new.name} ${payload.new.location}`,
					);
					await sendLocation();
				},
			)
			.subscribe();

		// Cleanup the listener on component unmount
		return () => {
			listener.then((v) => v.remove());
			disasterChannel.unsubscribe();
		};
	}, []);

	return (
		<>
            {/*<Button onClick={triggerNotification}>TEST NOTIF</Button> */}
			<Outlet />
			<Toaster richColors closeButton theme="light" position="top-right" />

			<TanStackRouterDevtools position="bottom-right" />
		</>
	);
}

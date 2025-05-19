import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { ApiResponse, getApiEndpoint } from "@/lib/api";
import { BasicReport, SaveLocationRequest } from "@/lib/report";
import { PriorityItem } from "./-components/priority-item";
import useWebSocket from "react-use-websocket";
import {
	WEBSOCKET_OPTIONS,
	WEBSOCKET_URL,
	WebSocketEvent,
	WebSocketMessage,
} from "@/lib/websocket";

export const Route = createFileRoute("/_authed/map/")({
	component: RouteComponent,
	loader: async () => {
		const response = await CapacitorHttp.get({
			url: `${getApiEndpoint()}/api/reports`,
		});
		const result: ApiResponse<BasicReport[]> = response.data;
		if (response.status !== 200) {
			throw new Error(result.message);
		}

		return { reports: result.data };
	},
});

function RouteComponent() {
	const loaderData = Route.useLoaderData();
	const [reports, setReports] = useState<BasicReport[]>(loaderData.reports);

	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<GoogleMap | null>(null);
	const [mapInstance, setMapInstance] = useState<GoogleMap | null>(null);
	const markerMap = useRef<Map<string, string>>(new Map());

	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		share: true,
		async onMessage(event) {
			const result: WebSocketMessage = JSON.parse(event.data);

			console.log(result);

			switch (result.event) {
				case WebSocketEvent.SaveLocation:
					const data = result.data as SaveLocationRequest;

					setReports((prev) =>
						prev.map((report) =>
							report.reporter.id === data.reporterId
								? { ...report, location: data.location }
								: report,
						),
					);

					const markerId = markerMap.current.get(data.reporterId);
					if (!markerId || !mapRef.current) {
						break;
					}

					await mapRef.current.removeMarker(markerId);

					const newMarkerId = await mapRef.current.addMarker({
						coordinate: {
							lat: data.location.latitude,
							lng: data.location.longitude,
						},
					});

					markerMap.current.set(data.reporterId, newMarkerId);
					break;
			}
		},
	});

	async function createMap(): Promise<void> {
		if (!mapContainerRef.current) return;

		try {
			const googleMap = await GoogleMap.create({
				id: "map",
				element: mapContainerRef.current,
				apiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
				config: {
					center: {
						lat: 33.6,
						lng: -117.9,
					},
					zoom: 2,
				},
			});

			mapRef.current = googleMap;
			setMapInstance(googleMap);

			await googleMap.enableCurrentLocation(true);

			if (Capacitor.getPlatform() === "android") {
				const position = await Geolocation.getCurrentPosition();
				const lat = position.coords.latitude;
				const long = position.coords.longitude;

				await googleMap.addMarker({
					coordinate: {
						lat: lat,
						lng: long,
					},
				});

				await googleMap.setCamera({
					coordinate: {
						lat: lat,
						lng: long,
					},
				});
			}

			for (const report of loaderData.reports) {
				if (!report.location) {
					continue;
				}

				const markerId = await googleMap.addMarker({
					coordinate: {
						lat: report.location.latitude,
						lng: report.location.longitude,
					},
				});

				markerMap.current.set(report.reporter.id, markerId);
			}
		} catch (error) {
			console.error("Failed to create map:", error);
		}
	}

	useEffect(() => {
		createMap();

		return () => {
			if (mapRef.current) {
				mapRef.current.destroy();
				setMapInstance(null);
			}
		};
	}, []);

	return (
		<div className="flex flex-col h-svh w-full">
			<div ref={mapContainerRef} className="z-0 h-3/5 w-full" id="map"></div>

			<div className="bg-background p-6 h-2/5">
				<h1 className="font-playfair-display-bold mb-4">Highest Priorities</h1>

				<div className="divide-foreground/10 divide-y overflow-y-scroll">
					{reports.map((report) => {
						return (
							<PriorityItem report={report} map={mapInstance} key={report.id} />
						);
					})}
					{reports.map((report) => {
						return (
							<PriorityItem report={report} map={mapInstance} key={report.id} />
						);
					})}
				</div>
			</div>
		</div>
	);
}

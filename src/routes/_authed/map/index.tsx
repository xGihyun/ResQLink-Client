import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { ApiResponse } from "@/lib/api";
import { BasicReport } from "@/lib/report";
import { PriorityItem } from "./-components/priority-item";

export const Route = createFileRoute("/_authed/map/")({
	component: RouteComponent,
	loader: async () => {
		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/reports`,
			{
				method: "GET",
			},
		);
		const result: ApiResponse<BasicReport[]> = await response.json();
		if (!response.ok) {
			throw new Error(result.message);
		}

		return { reports: result.data };
	},
});

function RouteComponent() {
	const loaderData = Route.useLoaderData();

	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<GoogleMap | null>(null);
	const [mapInstance, setMapInstance] = useState<GoogleMap | null>(null);

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

				await googleMap.addMarkers([
					{
						coordinate: {
							lat: report.location.latitude,
							lng: report.location.longitude,
						},
					},
				]);
			}
		} catch (error) {
			console.error("Failed to create map:", error);
		}
	}

	useEffect(() => {
		createMap();
	}, []);

	return (
		<div className="h-full w-full">
			<div ref={mapContainerRef} className="z-0 h-3/5 w-full" id="map"></div>

			<div className="p-6">
				<h1 className="font-playfair-display-bold mb-4">Highest Priorities</h1>

				<div className="divide-foreground/10 divide-y overflow-y-scroll">
					{loaderData.reports.map((report) => {
						return (
							<PriorityItem report={report} map={mapInstance} key={report.id} />
						);
					})}
				</div>
			</div>
		</div>
	);
}

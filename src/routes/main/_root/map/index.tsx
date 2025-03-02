import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import supabase from "@/lib/supabase";

export const Route = createFileRoute("/main/_root/map/")({
	component: RouteComponent,
});

type Victim = {
	victim_report_id: string;
	created_at: string;
	ai_gen_situation?: string;
	status: string;
	photo_evidence_url?: string;
	responded_at?: string;
	user_near?: string;
	lat?: number;
	long?: number;
	is_distressed?: boolean;
	user_id: string;
	users: {
		first_name: string;
		last_name: string;
	};
};

function RouteComponent() {
	const mapRef = useRef<HTMLDivElement | null>(null);
	let newMap: GoogleMap;

	async function createMap() {
		if (!mapRef.current) return;

		try {
			newMap = await GoogleMap.create({
				id: "map",
				element: mapRef.current,
				apiKey: "",
				config: {
					center: {
						lat: 33.6,
						lng: -117.9,
					},
					zoom: 2,
				},
			});
			await newMap.enableCurrentLocation(true);

			if (Capacitor.getPlatform() == "android") {
				const position = await Geolocation.getCurrentPosition();
				const lat = position.coords.latitude;
				const long = position.coords.longitude;

				await newMap.addMarker({
					coordinate: {
						lat: lat,
						lng: long,
					},
				});

				await newMap.setCamera({
					coordinate: {
						lat: lat,
						lng: long,
					},
				});
			}
		} catch (error) {}
	}

	const [priorities, setPriorities] = useState<Victim[]>([]);

	useEffect(() => {
		const foo = async () => {
			await createMap();

			const getVictims = async () => {
				const victims = await supabase
					.from("victim_reports")
					.select(`*, users (first_name, last_name)`)
					.is("responded_at", null);

				setPriorities((victims.data as Victim[]) || []);

				for (const priority of victims.data!) {
					if (priority.lat === null || priority.long === null) {
						return;
					}

					await newMap.addMarkers([
						{
							coordinate: {
								lat: priority.lat,
								lng: priority.long,
							},
						},
					]);
				}
			};

			await getVictims();
		};

		foo();
	}, []);

	return (
		<div className="w-full h-screen">
			<div ref={mapRef} className="w-full h-[70%] z-0" id="map"></div>
			<div className="flex flex-col items-center justify-center z-20 h-fit bg-white p-6 *:w-full *:max-w-md">
				<div className="flex flex-row justify-between items-center">
					<span className="font-bold my-2">Highest Priorities</span>
					<span className="text-xs text-gray-400 underline my-2">
						View More
					</span>
				</div>

				<div className="h-32 overflow-y-scroll">
					{priorities.map((priority) => {
						return <PriorityItem priority={priority} />;
					})}
				</div>
			</div>
		</div>
	);
}

type PriorityItemProps = {
	priority: Victim;
};

function PriorityItem(props: PriorityItemProps) {
	return (
		<div className="flex flex-row items-center gap-4 border-b-[1px] border-black py-2">
			<span className="text-xs bg-red-400 p-2 px-4 text-white rounded-xl h-full">
				{props.priority.status}
			</span>

			<div className="flex-1 flex flex-row justify-between items-center">
				<span className="text-xs">
					{props.priority.users.first_name} {props.priority.users.last_name}
				</span>
				<span className="text-xs text-gray-400">
					{props.priority.created_at}
				</span>
			</div>
		</div>
	);
}

import { SaveLocationRequest } from "@/lib/report";
import {
	WEBSOCKET_OPTIONS,
	WEBSOCKET_URL,
	WebSocketEvent,
	WebSocketMessage,
} from "@/lib/websocket";
import { Geolocation } from "@capacitor/geolocation";
import { useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

type Props = {
	reporterId: string;
};

export function LocationTracker(props: Props) {
	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		share: true,
	});
	const intervalId = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		intervalId.current = setInterval(async () => {
			try {
				const position = await Geolocation.getCurrentPosition();

				const req: SaveLocationRequest = {
					location: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					},
					reporterId: props.reporterId,
				};
				const msg: WebSocketMessage<SaveLocationRequest> = {
					event: WebSocketEvent.SaveLocation,
					data: req,
				};

				if (socket.readyState === ReadyState.OPEN) {
					socket.sendJsonMessage(msg);
				}
			} catch (error) {
				console.error("Failed to get location:", error);
				if (intervalId.current) {
					clearInterval(intervalId.current);
				}
			}
		}, 3000);

		return () => {
			if (intervalId.current) {
				clearInterval(intervalId.current);
			}
		};
	});

	return null;
}

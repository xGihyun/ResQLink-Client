import { Options } from "react-use-websocket";

export enum WebSocketEvent {
	CreateReport = "disaster:create_report",
	SaveLocation = "disaster:save_location",
	SetResponder = "disaster:set_responder",

	Heartbeat = "heartbeat",
}

export type WebSocketMessage<T = any> = {
	event: WebSocketEvent;
	data: T;
};

export const WEBSOCKET_OPTIONS: Options = {
	onOpen: () => {
		console.log("WebSocket opened.");
	},
	onClose: () => {
		console.log("WebSocket connection is closing...");
	},
	onError: (e) => {
		console.error("WebSocket error:", e);
	},
	shouldReconnect: (_) => true,
	heartbeat: {
		message: () => {
			const data: WebSocketMessage = {
				event: WebSocketEvent.Heartbeat,
				data: "Heartbeat!",
			};

			return JSON.stringify(data);
		},
		timeout: 60000,
		interval: 25000,
	},
	reconnectAttempts: 10,
};

export const WEBSOCKET_URL = `ws://10.0.2.2:3002/ws`;

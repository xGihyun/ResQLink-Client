import { Capacitor } from "@capacitor/core";
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

function getWebSocketUrl(): string {
	if (Capacitor.getPlatform() === "android") {
		return `ws://192.168.254.106:3002/ws`;
	}

	return `ws://192.168.254.106:3002/ws`;
}

export const WEBSOCKET_URL = getWebSocketUrl();

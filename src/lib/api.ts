import { Capacitor } from "@capacitor/core";

export type ApiResponse<T = unknown> = {
	code: number;
	message: string;
	data: T;
};

export function getApiEndpoint(): string {
	if (Capacitor.getPlatform() === "android") {
		return `http://192.168.254.106:3002`;
	}

	return `http://192.168.254.106:3002`;
}

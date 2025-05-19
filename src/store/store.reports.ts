import { ApiResponse, getApiEndpoint } from "@/lib/api";
import {
	BasicReport,
	SaveLocationRequest,
	SetResponderRequest,
	SetResponderResponse,
} from "@/lib/report";
import { CapacitorHttp } from "@capacitor/core";
import { create } from "zustand/react";

type ReportState = {
	reports: BasicReport[];
	unrespondedReports: BasicReport[];
	getReports: () => Promise<ApiResponse<BasicReport[]>>;
	setResponder: (
		request: SetResponderRequest,
	) => Promise<ApiResponse<SetResponderResponse>>;
	saveLocation: (request: SaveLocationRequest) => void;
};

export const useReportsStore = create<ReportState>((set, get) => {
	async function getReports(): Promise<ApiResponse<BasicReport[]>> {
		const response = await CapacitorHttp.get({
			url: `${getApiEndpoint()}/api/reports`,
		});
		const result: ApiResponse<BasicReport[]> = response.data;
		if (result.code === 200) {
			// Calculate unresponded reports when setting reports
			const unresponded = result.data.filter((report) => !report.responder);
			set({
				reports: result.data,
				unrespondedReports: unresponded,
			});
		}
		return result;
	}

	async function setResponder(
		request: SetResponderRequest,
	): Promise<ApiResponse<SetResponderResponse>> {
		const response = await CapacitorHttp.patch({
			url: `${getApiEndpoint()}/api/reporters/${request.reporterId}/reports`,
			data: request,
			headers: {
				"Content-Type": "application/json",
			},
		});
		const result: ApiResponse<SetResponderResponse> = response.data;

		if (result.code === 200) {
			set((state) => {
				// Update reports and recalculate unresponded reports
				const updatedReports = state.reports.map((report) => {
					if (report.reporter.id === request.reporterId) {
						return {
							...report,
							responder: result.data.responder,
						};
					}
					return report;
				});

				return {
					reports: updatedReports,
					unrespondedReports: updatedReports.filter(
						(report) => !report.responder,
					),
				};
			});
		}

		return result;
	}

	function saveLocation(request: SaveLocationRequest): void {
		set((state) => {
			// Update reports with new location information
			const updatedReports = state.reports.map((report) =>
				report.reporter.id === request.reporterId
					? { ...report, location: request.location }
					: report,
			);

			// Only unresponded reports should be updated
			const updatedUnresponded = updatedReports.filter(
				(report) => !report.responder,
			);

			return {
				reports: updatedReports,
				unrespondedReports: updatedUnresponded,
			};
		});
	}

	return {
		reports: [],
		unrespondedReports: [],
		getReports,
		setResponder,
		saveLocation,
	};
});

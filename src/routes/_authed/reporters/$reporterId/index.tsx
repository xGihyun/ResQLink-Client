import { createFileRoute } from "@tanstack/react-router";
import { JSX } from "react";
import { Button } from "@/components/ui/button";
import { LocationIcon } from "@/assets/icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { format } from "date-fns"; // <-- Import from date-fns
import { CapacitorHttp } from "@capacitor/core";
import { ApiResponse, getApiEndpoint } from "@/lib/api";
import {
	CitizenStatus,
	ReportsByReporter,
	SetResponderRequest,
	SetResponderResponse,
} from "@/lib/report";
import { formatName } from "@/lib/utils";
import { toast } from "sonner";
import { useReportsStore } from "@/store/store.reports";
import { useUserStore } from "@/store/store.user";

export const Route = createFileRoute("/_authed/reporters/$reporterId/")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const response = await CapacitorHttp.get({
			url: `${getApiEndpoint()}/api/reporters/${params.reporterId}/reports`,
		});
		const result: ApiResponse<ReportsByReporter> = response.data;
		if (response.status !== 200) {
			throw new Error(result.message);
		}

		return {
			userReport: result.data,
		};
	},
});

// NOTE: Horrible code, but whatever
const badgeColors: Record<string, string> = {
	in_danger: "bg-[#E57373] text-white",
	at_risk: "bg-[#FFB74D] text-white",
	safe: "bg-[#81C784] text-white",
};

const STATUS_OPTIONS = {
	safe: "Safe",
	at_risk: "At Risk",
	in_danger: "In Danger",
};

function RouteComponent(): JSX.Element {
	const loaderData = Route.useLoaderData();
	const routeContext = Route.useRouteContext();
	const reportsStore = useReportsStore();
	const currentUser = useUserStore().user;

	const initials = loaderData.userReport.reporter.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();

	// FIXME: using `routeContext` doesn't work since the data is undefined for some reason
	// when running on Android.

	async function setResponder(): Promise<void> {
		const toastId = toast.loading("Marking as responded...");

		if (!currentUser) {
			toast.error("Current user not found.", { id: toastId });
			return;
		}

		const request: SetResponderRequest = {
			reporterId: loaderData.userReport.reporter.id,
			responder: {
				name: formatName({
					firstName: currentUser.firstName,
					middleName: currentUser.middleName,
					lastName: currentUser.lastName,
				}),
				userId: currentUser.id,
			},
		};

		const result = await reportsStore.setResponder(request);
		if (result.code !== 200) {
			toast.error(result.message, { id: toastId });
			return;
		}

		toast.success(result.message, { id: toastId });
	}

	return (
		<div className="bg-background h-svh w-full">
			<div className="mx-auto flex h-full w-full max-w-md min-w-[300px] flex-col items-center justify-start gap-6 p-4">
				<div className="flex w-full flex-col gap-3">
					<h1 className="font-playfair-display-black text-primary text-2xl">
						Victim Status Report
					</h1>
					<hr className="border-primary border" />
				</div>

				<div className="flex w-full items-center justify-between gap-2">
					<div className="flex w-full items-center gap-2">
						<Avatar className="size-12">
							<AvatarImage
								src="/path-to-image.jpg"
								alt={loaderData.userReport.reporter.name}
							/>
							<AvatarFallback className="bg-primary text-primary-foreground">
								{initials}
							</AvatarFallback>
						</Avatar>

						<div className="">
							<h2 className="font-playfair-display-bold text-lg">
								{loaderData.userReport.reporter.name}
							</h2>

							<p className="text-muted-foreground font-poppins text-sm">
								Last Update at{" "}
								{format(loaderData.userReport.reports[0].createdAt, "hh:mm a")}
							</p>
						</div>
					</div>

					{/* <Badge>{priority} Priority</Badge> */}
				</div>

				{/* <div className="bg-primary flex w-full items-center gap-2 rounded-lg px-4 py-2 text-white"> */}
				{/* 	<img className="text-lg" src={LocationIcon} /> */}
				{/* 	<span className="text-sm font-medium">Location: </span> */}
				{/* </div> */}

				{/* <div className="text-left w-full"> */}
				{/* 	<h2 className="font-playfair-display mt-4 inline-flex items-center text-xl font-bold"> */}
				{/* 		Status Timeline{" "} */}
				{/* 		<sup className="font-poppins text-neutral ml-1 max-w-7/12 text-[10px] font-normal"> */}
				{/* 			(A.I. Generated Summary 🤖) */}
				{/* 		</sup> */}
				{/* 	</h2> */}
				{/* </div> */}

				<div className="mt-6 w-full">
					<h2 className="font-playfair-display-bold mb-3 text-xl">Reports</h2>

					<div className="max-h-72 space-y-4 overflow-y-auto">
						{loaderData.userReport.reports
							.filter((report) => !report.responder)
							.map((report) => (
								<div
									key={report.id}
									className="flex flex-col gap-2 rounded-lg border bg-white p-4 shadow"
								>
									<div className="flex items-center justify-between">
										<Badge
											className={`rounded-md px-3 py-1 ${badgeColors[report.status]}`}
										>
											{STATUS_OPTIONS[report.status]}
										</Badge>
										<span className="text-muted-foreground text-xs">
											{format(report.createdAt, "LLLL dd, yyyy - hh:mm a")}
										</span>
									</div>

									<p className="text-sm font-medium">{report.rawSituation}</p>

									<div className="">
										{report.photoUrls && (
											<div className="flex max-w-fit items-center gap-1 rounded-md border border-blue-500 px-3 py-1 text-xs text-blue-500">
												<Camera className="me-1 h-5 w-5" /> Image Available
											</div>
										)}
									</div>
								</div>
							))}
					</div>
				</div>

				<Button
					className="font-poppins-bold min-h-12 w-full"
					onClick={setResponder}
				>
					Mark as Responded
				</Button>
			</div>
		</div>
	);
}

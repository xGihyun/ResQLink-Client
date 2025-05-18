import { Badge, badgeVariants } from "@/components/ui/badge";
import { BasicReport, CitizenStatus } from "@/lib/report";
import { GoogleMap } from "@capacitor/google-maps";
import { VariantProps } from "class-variance-authority";
import { format } from "date-fns";
import { JSX } from "react";

type PriorityItemProps = {
	report: BasicReport;
	map: GoogleMap | null;
};

type StatusItem = {
	label: string;
	value: CitizenStatus;
	variant: VariantProps<typeof badgeVariants>["variant"];
};

const statusItems: StatusItem[] = [
	{
		label: "Safe",
		value: CitizenStatus.Safe,
		variant: "default",
	},
	{
		label: "At Risk",
		value: CitizenStatus.AtRisk,
		variant: "warn",
	},
	{
		label: "In Danger",
		value: CitizenStatus.InDanger,
		variant: "destructive",
	},
];

export function PriorityItem(props: PriorityItemProps): JSX.Element {
	const status =
		statusItems.find((item) => item.value === props.report.status) ||
		({
			label: "Unknown",
			variant: "secondary",
		} as StatusItem);

	async function handleFocus(): Promise<void> {
		if (!props.map) {
			console.warn("Map not found");
			return;
		}

		if (!props.report.location) {
			console.warn("Location not found");
			return;
		}

		await props.map.setCamera({
			coordinate: {
				lat: props.report.location.latitude,
				lng: props.report.location.longitude,
			},
			zoom: 10,
		});
	}

	return (
		<button
			className="flex w-full items-center justify-between gap-2 py-2"
			onClick={handleFocus}
		>
			<div className="flex items-center gap-2">
				<Badge variant={status.variant} className="font-playfair-display-bold">
					{status.label}
				</Badge>
				<p>{props.report.reporter.name}</p>
			</div>

			<div>{format(props.report.createdAt, "hh:mm a")}</div>
		</button>
	);
}

import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, CameraResultType } from "@capacitor/camera";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import { reportSchema, ReportSchema } from "./-schema";
import { JSX } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { StatusItem } from "./-components/status-item";
import { Label } from "@/components/ui/label";
import { cn, fileToBase64, formatName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/lib/api";
import { toast } from "sonner";
import { CitizenStatus } from "@/lib/report";
import { CapacitorHttp } from "@capacitor/core";

export const Route = createFileRoute("/_authed/report/")({
	component: RouteComponent,
});

type StatusOption = {
	label: string;
	value: CitizenStatus;
	class: string;
	description: string;
	checkInDetails: string;
	icon: JSX.Element;
};

const STATUS_OPTIONS: StatusOption[] = [
	{
		label: "Safe",
		value: CitizenStatus.Safe,
		class: "bg-primary",
		description: "I am safe and well",
		checkInDetails: "Check-ins every 24 hours",
		icon: <ShieldCheck className="text-white" />,
	},
	{
		label: "At Risk",
		value: CitizenStatus.AtRisk,
		class: "bg-[#ffb74d]",
		description: "I may need assistance soon",
		checkInDetails: "Check-ins every 8 hours",
		icon: <AlertTriangle className="text-white" />,
	},
	{
		label: "In Danger",
		value: CitizenStatus.InDanger,
		class: "bg-[#e57373]",
		description: "I need immediate help",
		checkInDetails: "Check-ins every hour",
		icon: <ShieldAlert className="text-white" />,
	},
];

function RouteComponent(): JSX.Element {
	const routeContext = Route.useRouteContext();

	const form = useForm<ReportSchema>({
		resolver: zodResolver(reportSchema),
		defaultValues: {
			rawSituation: "",
			name: formatName({
				firstName: routeContext.user.firstName,
				middleName: routeContext.user.middleName,
				lastName: routeContext.user.lastName,
			}),
			photos: [],
		},
	});

	async function onSubmit(value: ReportSchema): Promise<void> {
		const formData = new FormData();
		formData.append("userId", routeContext.user.id);
		formData.append("name", value.name);
		formData.append("status", value.status);
		formData.append("rawSituation", value.rawSituation);

		value.photos.forEach((photo) => {
			formData.append("photos", photo);
		});

		console.log(formData);

		const response = await CapacitorHttp.post({
			url: `${import.meta.env.VITE_BACKEND_URL}/api/reports`,
			data: formData,
			dataType: "formData",
		});
		const result: ApiResponse = response.data;
		if (response.status !== 201) {
			toast.error(result.message);
			return;
		}

		// TODO: Fetch inference

		toast.success(result.message);

		// TODO: Track user's location
	}

	async function handleTakePhoto(): Promise<void> {
		try {
			const photo = await Camera.getPhoto({
				quality: 90,
				resultType: CameraResultType.Uri,
			});

			if (!photo.webPath) {
				console.warn("No webPath taken for the photo");
				return;
			}

			const response = await CapacitorHttp.get({ url: photo.webPath });
			const binaryData = atob(response.data);
			const bytes = new Uint8Array(binaryData.length);

			for (let i = 0; i < binaryData.length; i++) {
				bytes[i] = binaryData.charCodeAt(i);
			}

			const blob = new Blob([bytes], {
				type: response.headers["content-type"] || "application/octet-stream",
			});
			// const blob = await response.blob();

			const fileName = `photo_${new Date().getTime()}.${photo.format}`;
			const file = new File([blob], fileName, { type: blob.type });

			const photos = form.getValues().photos;
			photos.push(file);
			form.setValue("photos", photos);
		} catch (error) {
			console.error("Error taking photo:", error);
		}
	}

	async function handleUploadImage(): Promise<void> {
		try {
			const result = await FilePicker.pickImages();
			if (result.files.length < 1) {
				return;
			}

			const photos = form.getValues().photos;

			result.files.forEach((file) => {
				if (!file.blob) {
					console.warn("File blob not found");
					return;
				}

				const f = new File([file.blob], file.name);
				photos.push(f);
			});

			form.setValue("photos", photos);
		} catch (error) {
			console.error("Error picking file:", error);
		}
	}

	return (
		<div className="bg-background h-svh w-full max-w-3xl">
			<div className="mx-auto flex h-full w-full max-w-md min-w-[300px] flex-col items-center justify-start gap-6 p-4">
				<div className="flex w-full flex-col gap-3">
					<div className="font-playfair-display-black text-primary text-2xl">
						Emergency Status Update
					</div>
					<hr className="border-primary border" />
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, (errors) =>
							console.error(errors),
						)}
						className="w-full space-y-4"
						encType="multipart/form-data"
					>
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-playfair-display-semibold text-base">
										How are You?
									</FormLabel>

									<FormControl>
										<RadioGroup
											className="gap-2"
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											{STATUS_OPTIONS.map((statusOption) => (
												<FormItem key={statusOption.value}>
													<FormControl>
														<div
															className={cn(
																"border-input has-data-[state=checked]:border-ring text-background relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none",
																statusOption.class,
															)}
														>
															<StatusItem
																id={statusOption.value}
																value={statusOption.value}
																className="order-1 after:absolute after:inset-0"
															/>

															<div className="flex grow items-center gap-3">
																{statusOption.icon}
																<div className="grid grow gap-0">
																	<Label
																		htmlFor={statusOption.value}
																		className="font-playfair-display-black text-xl"
																	>
																		{statusOption.label}
																	</Label>
																	<p className="text-xs">
																		{statusOption.description}
																	</p>
																</div>
															</div>
														</div>
													</FormControl>
												</FormItem>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="rawSituation"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel className="font-playfair-display-semibold text-base">
										Describe Your Situation
									</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex w-full flex-col gap-3">
							<div className="font-playfair-display-semibold text-base">
								Add Photo Evidence
							</div>
							<div className="flex w-full flex-col gap-2">
								<Button type="button" onClick={handleTakePhoto} size="lg">
									Take Photo
								</Button>
								<Button
									type="button"
									onClick={handleUploadImage}
									size="lg"
									variant="secondary"
								>
									Upload Image
								</Button>
							</div>

							<FormField
								control={form.control}
								name="photos"
								render={() => (
									<FormItem>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button
							type="submit"
							size="lg"
							className="font-poppins-bold w-full"
						>
							Submit
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}

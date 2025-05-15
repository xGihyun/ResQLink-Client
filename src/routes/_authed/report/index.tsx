import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { CitizenStatus } from "./-types";
import { Label } from "@/components/ui/label";
import { cn, formatName } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
	const [photoSrc, setPhotoSrc] = useState<string | null>(null);

	const form = useForm<ReportSchema>({
		resolver: zodResolver(reportSchema),
		defaultValues: {
			userId: routeContext.user.userId,
			rawSituation: "",
			photos: "",
			name: formatName({
				firstName: routeContext.user.firstName,
				middleName: routeContext.user.middleName,
				lastName: routeContext.user.lastName,
			}),
		},
	});

	async function onSubmit(data: ReportSchema): Promise<void> {
		console.log("Form Data:", data);

		// TODO: Fetch inference
	}

	async function handleTakePhoto(): Promise<void> {
		try {
			const photo = await Camera.getPhoto({
				quality: 90,
				resultType: CameraResultType.Uri,
			});
			const photoUrl = photo.webPath || null;
			setPhotoSrc(photoUrl);
			if (photoUrl) {
				form.setValue("photos", photoUrl);
			}
		} catch (error) {
			console.error("Error taking photo:", error);
		}
	}

	async function handleUploadImage(): Promise<void> {
		try {
			const result = await FilePicker.pickImages();
			if (result.files.length > 0) {
				const fileBlob = result.files[0].blob!;
				const objectUrl = URL.createObjectURL(fileBlob);
				setPhotoSrc(objectUrl);
				form.setValue("photos", fileBlob);
			}
		} catch (error) {
			console.error("Error picking file:", error);
		}
	}

	return (
		<div className="mx-auto flex h-screen w-full max-w-md min-w-[300px] flex-col items-center justify-start gap-6 p-4">
			<div className="flex w-full flex-col gap-3">
				<div className="font-playfair-display-black text-primary text-2xl">
					Emergency Status Update
				</div>
				<hr className="border-primary border" />
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full space-y-4"
				>
					<FormField
						control={form.control}
						name="status"
						render={({ field, fieldState }) => (
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
								<FormMessage>{fieldState.error?.message}</FormMessage>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="rawSituation"
						render={({ field, fieldState }) => (
							<FormItem className="w-full">
								<FormLabel className="font-playfair-display-semibold text-base">
									Describe Your Situation
								</FormLabel>
								<FormControl>
									<Textarea {...field} className="text-base" />
								</FormControl>
								<FormMessage>{fieldState.error?.message}</FormMessage>
							</FormItem>
						)}
					/>

					<div className="flex w-full flex-col gap-3">
						<div className="font-playfair-display-semibold text-base">
							Add Photo Evidence
						</div>
						<div className="flex w-full flex-col gap-2">
							<Button onClick={handleTakePhoto} size="lg">
								Take Photo
							</Button>
							<Button onClick={handleUploadImage} size="lg" variant="secondary">
								Upload Image
							</Button>
						</div>

						<FormField
							control={form.control}
							name="photos"
							render={({ fieldState }) => (
								<FormItem>
									<FormMessage>{fieldState.error?.message}</FormMessage>
								</FormItem>
							)}
						/>
					</div>

					<Button type="submit" size="lg" className="font-poppins-bold w-full">
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
}

export default RouteComponent;

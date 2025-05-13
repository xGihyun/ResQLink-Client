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
import {
	CheckCircle,
	ShieldCheck,
	AlertTriangle,
	ShieldAlert,
	X,
} from "lucide-react";
import { statusSchema, StatusSchema } from "./-schema";
import { JSX } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { StatusItem } from "./-components/status-item";
import { CitizenStatus } from "./-types";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
	const [showModal, setShowModal] = useState(false);
	const [photoSrc, setPhotoSrc] = useState<string | null>(null);

	const form = useForm<StatusSchema>({
		resolver: zodResolver(statusSchema),
		defaultValues: { status: undefined, description: "", photo: "" },
	});

	async function onSubmit(data: StatusSchema): Promise<void> {
		console.log("Form Data:", data);
		setShowModal(true);

		// TODO: Fetch inference

		setTimeout(() => setShowModal(false), 2000); // Auto-hide modal after 2 sec
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
				form.setValue("photo", photoUrl);
			}
		} catch (error) {
			console.error("Error taking photo:", error);
		}
	}

	async function handleUploadImage(): Promise<void> {
		try {
			const result = await FilePicker.pickImages();
			if (result.files && result.files.length > 0) {
				const fileBlob = result.files[0].blob!;
				const objectUrl = URL.createObjectURL(fileBlob);
				setPhotoSrc(objectUrl);
				form.setValue("photo", fileBlob);
			}
		} catch (error) {
			console.error("Error picking file:", error);
		}
	}

	return (
		<div className="mx-auto flex h-screen w-full max-w-md min-w-[300px] flex-col items-center justify-start gap-6 p-4">
			<div className="flex w-full flex-col gap-3">
				<div className="font-playfair-display text-left text-2xl font-black text-[#5bbea9]">
					Emergency Status Update
				</div>
				<div className="border border-[#5bbea9]"></div>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex w-full flex-col gap-4"
				>
					<div className="font-playfair-display mb-2 w-full text-left text-base font-semibold text-black">
						How are You?
					</div>

					{/* Status Selection */}
					<FormField
						control={form.control}
						name="status"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<RadioGroup
										className="gap-2"
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										{STATUS_OPTIONS.map((statusOption) => (
											<FormItem>
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
															<div className="grid grow gap-2">
																<Label htmlFor={statusOption.value}>
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

					{/* Description field */}
					<FormField
						control={form.control}
						name="description"
						render={({ field, fieldState }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormLabel className="font-playfair-display text-base font-semibold text-black">
									Describe Your Situation
								</FormLabel>
								<FormControl>
									<Textarea {...field} />
								</FormControl>
								<FormMessage>{fieldState.error?.message}</FormMessage>
							</FormItem>
						)}
					/>

					{/* Photo Evidence Section */}
					<div className="flex w-full flex-col gap-3">
						<div className="font-playfair-display text-base font-semibold text-black">
							Add Photo Evidence
						</div>
						<div className="flex w-full flex-col gap-2">
							<button
								type="button"
								onClick={handleTakePhoto}
								className="min-h-12 w-full rounded-lg bg-[#5bbea9] font-['Poppins'] text-sm font-bold text-white"
							>
								Take Photo
							</button>
							<button
								type="button"
								onClick={handleUploadImage}
								className="min-h-12 w-full rounded-lg bg-[#6f7ec6] font-['Poppins'] text-sm font-bold text-white"
							>
								Upload Image
							</button>
						</div>
						{photoSrc && (
							<div className="mt-4">
								<img
									src={photoSrc}
									alt="Photo Evidence"
									className="h-auto w-full rounded-md"
								/>
							</div>
						)}
						{/* Optional: Display error message for photo field */}
						<FormField
							control={form.control}
							name="photo"
							render={({ fieldState }) => (
								<FormItem>
									<FormMessage>{fieldState.error?.message}</FormMessage>
								</FormItem>
							)}
						/>
					</div>

					<button
						type="submit"
						className="mt-4 w-full rounded-lg bg-[#5bbea9] py-3 font-['Poppins'] text-sm font-bold text-white"
					>
						Submit Update
					</button>
				</form>
			</Form>

			{/* Success Modal */}
			{showModal && (
				<div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
					<div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-lg">
						<CheckCircle className="h-12 w-12 text-green-500" />
						<p className="font-playfair-display text-lg font-semibold text-gray-800">
							Status Submitted Successfully!
						</p>
						<button
							onClick={() => setShowModal(false)}
							className="text-gray-500 hover:text-gray-700"
						>
							<X className="h-6 w-6" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default RouteComponent;

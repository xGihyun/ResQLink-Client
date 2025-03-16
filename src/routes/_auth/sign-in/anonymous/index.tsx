import { createFileRoute, Link } from "@tanstack/react-router";
import { anonymousSignUpSchema, AnonymousSignUpSchema } from "./-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resqlinkLogoText } from "@/assets/logos";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/sign-in/anonymous/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();

	// Set validation mode to "onSubmit" to avoid immediate inline feedback after changes.
	const form = useForm<AnonymousSignUpSchema>({
		mode: "onSubmit",
		reValidateMode: "onSubmit",
		resolver: zodResolver(anonymousSignUpSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
		},
	});

	async function onSubmit(value: AnonymousSignUpSchema) {
		let toastId = toast.loading("Logging in...");

		//await auth.loginAnonymous()
		//
		//if (auth.error) {
		//	toast.error(auth.error, { id: toastId });
		//	console.error(auth.error);
		//	return;
		//}

		toast.success("Welcome to ResQLink!", { id: toastId });

		navigate({ to: "/main/map" });
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-start px-5 py-10">
			<img src={resqlinkLogoText} className="mx-auto" />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 mt-12 min-w-[300px] w-full max-w-md"
				>
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input
										className="min-h-12 bg-input-background"
										placeholder="First Name"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input
										className="min-h-12 bg-input-background"
										placeholder="Last Name"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full min-h-12">
						Continue as Guest
					</Button>

					<p className="text-sm text-center  text-neutral mx-auto hover:underline">
						Already have an account?{" "}
						<Link className="underline text-primary" to="/sign-in">
							Sign In
						</Link>
					</p>
				</form>
			</Form>
		</div>
	);
}

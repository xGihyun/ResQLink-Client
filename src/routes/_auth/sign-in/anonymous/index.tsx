import { createFileRoute, Link } from "@tanstack/react-router";
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
import { signInAnonymousSchema, SignInAnonymousSchema } from "./-schema";
import { JSX } from "react";

export const Route = createFileRoute("/_auth/sign-in/anonymous/")({
	component: RouteComponent,
});

function RouteComponent(): JSX.Element {
	const navigate = Route.useNavigate();
	const routeContext = Route.useRouteContext();

	// Set validation mode to "onSubmit" to avoid immediate inline feedback after changes.
	const form = useForm<SignInAnonymousSchema>({
		mode: "onSubmit",
		reValidateMode: "onSubmit",
		resolver: zodResolver(signInAnonymousSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
		},
	});

	async function onSubmit(value: SignInAnonymousSchema) {
		let toastId = toast.loading("Signing in...");

		const result = await routeContext.auth.signInAnonymous(
			value,
			"random-uuid",
		);
		if (result.code !== 200) {
			toast.error(result.message, { id: toastId });
			return;
		}
		toast.success(result.message, { id: toastId });

		navigate({ to: "/status" });
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-start px-5 py-10">
			<img src={resqlinkLogoText} className="mx-auto" />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-12 w-full max-w-md min-w-[300px] space-y-8"
				>
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input
										className="bg-input-background min-h-12"
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
										className="bg-input-background min-h-12"
										placeholder="Last Name"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="min-h-12 w-full">
						Continue as Guest
					</Button>

					<p className="text-neutral mx-auto text-center text-sm hover:underline">
						Already have an account?{" "}
						<Link className="text-primary underline" to="/sign-in">
							Sign In
						</Link>
					</p>
				</form>
			</Form>
		</div>
	);
}

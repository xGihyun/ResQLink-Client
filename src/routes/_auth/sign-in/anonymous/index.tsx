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
import { v4 as uuidv4 } from "uuid";

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

		const id = uuidv4();
		const result = await routeContext.auth.signInAnonymous(value, id);
		if (result.code !== 200) {
			toast.error(result.message, { id: toastId });
			return;
		}
		toast.success(result.message, { id: toastId });

		navigate({ to: "/status" });
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mt-12 flex h-full w-full flex-col items-center justify-between gap-4"
			>
				<div className="w-full space-y-4">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input
										className="min-h-12"
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
										className="min-h-12"
										placeholder="Last Name"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="w-full space-y-4">
					<Button type="submit" className="font-poppins-bold min-h-12 w-full">
						Continue as Guest
					</Button>

					<p className="text-neutral mx-auto text-center text-sm">
						Already have an account?{" "}
						<Link className="text-primary underline" to="/sign-in">
							Sign In
						</Link>
					</p>
				</div>
			</form>
		</Form>
	);
}

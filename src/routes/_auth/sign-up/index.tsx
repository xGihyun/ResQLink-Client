import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { EmailIcon } from "@/assets/icons/";
import { PasswordIcon } from "@/assets/icons/";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resqlinkLogoText } from "@/assets/logos";

import supabase from "@/lib/supabase";
import { useAuthStore } from "@/store/store.auth";
import { IllustrationResponder, IllustrationCitizen } from "@/assets/icons";
import { signUpSchema, SignUpSchema } from "./fillup-form/-schema";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/sign-up/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const auth = useAuthStore();

	// Set validation mode to "onSubmit" to avoid immediate inline feedback after changes.
	const form = useForm<SignUpSchema>({
		mode: "onSubmit",
		reValidateMode: "onSubmit",
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			email: "",
			password: "",
			confirm_password: "",
			has_accepted_terms: false,
		},
	});

	// State for toggling password visibility
	const [isVisible, setIsVisible] = useState(false);
	const [isVisibleConfirmPass, setIsVisibleConfirmPass] = useState(false);
	const toggleVisibility = () => setIsVisible((prev) => !prev);
	const toggleVisibilityConfirmPass = () =>
		setIsVisibleConfirmPass((prev) => !prev);

	async function onSubmit(values: SignUpSchema) {
		let toastId = toast.loading("Creating account...");

		const user = await auth.register(values.email, values.password);

		if (auth.error || !user) {
			toast.error(auth.error, { id: toastId });
			console.error(auth.error);
			return;
		}

		await supabase.from("users").insert({
			user_id: user.id,
			email: values.email,
			password: values.password,
			first_name: values.first_name,
			last_name: values.last_name,
			role: "resident",
			update_frequency: 15,
		});

		toast.success("Successfully registered!", { id: toastId });

		navigate({ to: "/sign-in" });
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-start px-5 py-10">
			<img src={resqlinkLogoText} className="mx-auto" />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 mt-12"
				>
					<FormField
						control={form.control}
						name="first_name"
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
						name="last_name"
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

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<div className="relative flex items-center w-full">
										<img
											src={EmailIcon}
											className="absolute left-3 w-5 h-5 text-gray-400"
											alt="Email Icon"
										/>
										<Input
											placeholder="Email"
											{...field}
											className="pl-10 min-h-12 bg-input-background"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Password Field with Toggle Visibility */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Password</FormLabel>
								<FormControl>
									<div className="relative flex items-center w-full">
										{/* Left-side Password Icon */}
										<img
											src={PasswordIcon}
											className="absolute left-3 w-5 h-5 text-gray-400"
											alt="Password Icon"
										/>

										{/* Input Field */}
										<Input
											placeholder="Password"
											type={isVisible ? "text" : "password"}
											{...field}
											className="pl-10 min-h-12 bg-input-background"
										/>

										{/* Toggle Visibility Button */}
										<button
											type="button"
											className="absolute transition-all duration-1000 inset-y-0 right-3 flex hover:cursor-pointer h-full w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 rounded-e-md outline-none focus:z-10"
											onClick={toggleVisibility}
											aria-label={isVisible ? "Hide password" : "Show password"}
											aria-pressed={isVisible}
										>
											{isVisible ? (
												<EyeIcon size={18} aria-hidden="true" />
											) : (
												<EyeOffIcon size={18} aria-hidden="true" />
											)}
										</button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirm_password"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Confirm your Password</FormLabel>
								<FormControl>
									<div className="relative flex items-center w-full">
										{/* Left-side Password Icon */}
										<img
											src={PasswordIcon}
											className="absolute left-3 w-5 h-5 text-gray-400"
											alt="Password Icon"
										/>

										{/* Input Field */}
										<Input
											placeholder="Confirm Password"
											type={isVisibleConfirmPass ? "text" : "password"}
											{...field}
											className="pl-10 min-h-12 bg-input-background"
										/>

										{/* Toggle Visibility Button */}
										<button
											type="button"
											className="absolute transition-all duration-1000 inset-y-0 right-3 flex hover:cursor-pointer h-full w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 rounded-e-md outline-none focus:z-10"
											onClick={toggleVisibilityConfirmPass}
											aria-label={
												isVisibleConfirmPass
													? "Hide confirm password"
													: "Show confirm password"
											}
											aria-pressed={isVisibleConfirmPass}
										>
											{isVisibleConfirmPass ? (
												<EyeIcon size={18} aria-hidden="true" />
											) : (
												<EyeOffIcon size={18} aria-hidden="true" />
											)}
										</button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="has_accepted_terms"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<div className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel className="font-light text-sm">
										By continuing, you accept our{" "}
										<span className="underline text-primary">
											Privacy Policy
										</span>{" "}
										and{" "}
										<span className="underline text-primary">Terms of Use</span>
									</FormLabel>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full min-h-12">
						Register
					</Button>

					<p className="text-sm text-center  text-neutral mx-auto hover:underline">
						Already have an account?{" "}
						<Link className="underline text-primary" to="/sign-in">
							Log In
						</Link>{" "}
						or{" "}
						<Link className="underline text-primary" to="/sign-in/anonymous">
							Continue as Guest
						</Link>
					</p>
				</form>
			</Form>
		</div>
	);
  
	return (
		<div className="min-h-screen flex flex-col items-center justify-start bg-primary-foreground px-4 md:px-8">
			<div className="flex flex-col items-center w-full max-w-md mt-12 mx-auto">
				{/* Logo/Branding */}
				<img
					src={resqlinkLogoText}
					className="mx-auto w-auto h-auto"
					alt="ResQLink Logo"
				/>

				<p className="text-base font-playfair-display text-accent font-medium mt-8 text-center max-w-7/12">
					Register as a <i>responder</i> or <i>citizen</i> and stay informed.
				</p>

				{/* Card Container */}
				<div className="grid grid-cols-2 gap-3 mt-12 w-full">
					{/* Responder Card */}
					<Link
						to="/sign-up/fillup-form"
						className="flex flex-col items-center border-[2.5px]   border-accent rounded-lg p-4
                       cursor-pointer hover:border-accent-600 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-600"
					>
						<img
							src={IllustrationResponder}
							alt="Responder"
							className="h-36 w-auto"
						/>
						<span className="text-sm text-neutral sr-only">
							Responder Image
						</span>
						<p className="font-medium text-accent mt-3">Responder</p>
					</Link>

					{/* Citizen Card */}
					<Link
						to="/sign-up/fillup-form"
						className="flex flex-col items-center border-[2.5px] border-accent rounded-lg p-4
                       cursor-pointer hover:border-accent-600 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-600"
					>
						<img
							src={IllustrationCitizen}
							alt="Citizen"
							className="h-36 w-auto"
						/>
						<span className="text-sm text-neutral sr-only">Citizen Image</span>
						<p className="font-medium text-accent mt-3">Citizen</p>
					</Link>
				</div>

				{/* Bottom Link */}
				<Link to="/sign-in" className="text-primary font-normal">
					<p className="text-center text-sm text-neutral mt-20">
						Already have an account?{" "}
						<span className="text-primary font-medium underline">Login</span>
					</p>
				</Link>
			</div>
		</div>
	);
}

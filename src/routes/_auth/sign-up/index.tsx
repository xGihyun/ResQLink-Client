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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { signUpSchema, SignUpSchema } from "./-schema";
import { toast } from "sonner";
import { ApiResponse } from "@/lib/api";

export const Route = createFileRoute("/_auth/sign-up/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();

	// Set validation mode to "onSubmit" to avoid immediate inline feedback after changes.
	const form = useForm<SignUpSchema>({
		mode: "onSubmit",
		reValidateMode: "onSubmit",
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			hasAcceptedTerms: false,
		},
	});

	const [isVisible, setIsVisible] = useState(false);
	const [isVisibleConfirmPass, setIsVisibleConfirmPass] = useState(false);

	async function onSubmit(value: SignUpSchema) {
		const toastId = toast.loading("Signing up...");

		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/sign-up`,
			{
				method: "POST",
				body: JSON.stringify(value),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		const result: ApiResponse = await response.json();
		if (result.code !== 200) {
			toast.error(result.message, { id: toastId });
			return;
		}

		toast.success(result.message, { id: toastId });

		navigate({ to: "/sign-in" });
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

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<div className="relative flex w-full items-center">
										<img
											src={EmailIcon}
											className="absolute left-3 h-5 w-5 text-gray-400"
											alt="Email Icon"
										/>
										<Input
											placeholder="Email"
											{...field}
											className="min-h-12 pl-10"
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
									<div className="relative flex w-full items-center">
										{/* Left-side Password Icon */}
										<img
											src={PasswordIcon}
											className="absolute left-3 h-5 w-5 text-gray-400"
											alt="Password Icon"
										/>

										{/* Input Field */}
										<Input
											placeholder="Password"
											type={isVisible ? "text" : "password"}
											{...field}
											className="min-h-12 pl-10"
										/>

										{/* Toggle Visibility Button */}
										<button
											type="button"
											className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 right-3 flex h-full w-9 items-center justify-center rounded-e-md transition-all duration-1000 outline-none hover:cursor-pointer focus:z-10"
											onClick={() => setIsVisible((prev) => !prev)}
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
						name="confirmPassword"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Confirm your Password</FormLabel>
								<FormControl>
									<div className="relative flex w-full items-center">
										{/* Left-side Password Icon */}
										<img
											src={PasswordIcon}
											className="absolute left-3 h-5 w-5 text-gray-400"
											alt="Password Icon"
										/>

										{/* Input Field */}
										<Input
											placeholder="Confirm Password"
											type={isVisibleConfirmPass ? "text" : "password"}
											{...field}
											className="min-h-12 pl-10"
										/>

										{/* Toggle Visibility Button */}
										<button
											type="button"
											className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 right-3 flex h-full w-9 items-center justify-center rounded-e-md transition-all duration-1000 outline-none hover:cursor-pointer focus:z-10"
											onClick={() => setIsVisibleConfirmPass((prev) => !prev)}
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
						name="hasAcceptedTerms"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<div className="flex flex-row items-center space-y-0 space-x-3">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel className="text-sm font-light">
										I accept the{" "}
										<span className="text-primary underline">
											Privacy Policy
										</span>{" "}
										and{" "}
										<span className="text-primary underline">Terms of Use</span>
									</FormLabel>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="min-h-12 w-full space-y-4">
					<Button type="submit" className="font-poppins-bold min-h-12 w-full">
						Sign Up
					</Button>

					<p className="text-neutral mx-auto text-center text-sm">
						Already have an account?{" "}
						<Link className="text-primary underline" to="/sign-in">
							Log In
						</Link>{" "}
						or{" "}
						<Link className="text-primary underline" to="/sign-in/anonymous">
							Continue as Guest
						</Link>
					</p>
				</div>
			</form>
		</Form>
	);
}

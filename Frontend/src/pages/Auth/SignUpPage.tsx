import { useSignUp } from "@clerk/clerk-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "../../components/Card/Card";
import Label from "../../components/Label/Label";
import { Input } from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { NavLink } from "react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

type SignUpFormData = {
	email: string;
	password: string;
	confirmPassword: string;
};

const schema = z
	.object({
		email: z.string().email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"],
	});

export default function SignUpPage() {
	const [isPending, setIsPending] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const { signUp } = useSignUp();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormData>({ resolver: zodResolver(schema) });

	async function onSubmit(data: SignUpFormData) {
		setIsPending(true);
		try {
			console.log("data", data);
			const result = await signUp?.create({
				emailAddress: data.email,
				password: data.password,
			});
			// Todo: create profile in DB
			// Todo: Add Loading state
		} catch (error) {
			console.error("Error signing up", error);
		} finally {
			setIsPending(false);
		}
	}
	return (
		<Card>
			<CardTitle className="mx-auto text-2xl font-semibold text-center">
				Create an Account
			</CardTitle>
			<CardDescription>
				Enter your credentials to create an account
			</CardDescription>
			<CardContent>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
					<Label className="p-0">
						<span className="sr-only">Email</span>
						<Input
							{...register("email")}
							type="text"
							name="email"
							placeholder="Email"
							className={errors.email && "input-error"}
						/>

						{errors.email && (
							<span className="text-error">{errors.email.message}</span>
						)}
					</Label>
					<Label className="relative p-0">
						<span className="sr-only">Password</span>
						<Input
							{...register("password")}
							type={showPassword ? "password" : "text"}
							name="password"
							placeholder="Password"
							className={errors.password && "input-error"}
						/>
						<button onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? (
								<Eye className="absolute right-3 top-1 text-base-content/60" />
							) : (
								<EyeOff className="absolute right-3 top-1 text-base-content/60" />
							)}
						</button>
						{errors.password && (
							<span className="text-error">{errors.password.message}</span>
						)}
					</Label>
					<Label className="relative p-0">
						<span className="sr-only">Confirm Password</span>
						<Input
							{...register("confirmPassword")}
							type={showPassword ? "password" : "text"}
							name="confirmPassword"
							placeholder="Confirm Password"
							className={errors.confirmPassword && "input-error"}
						/>
						<button onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? (
								<Eye className="absolute right-3 top-1 text-base-content/60" />
							) : (
								<EyeOff className="absolute right-3 top-1 text-base-content/60" />
							)}
						</button>
						{errors.confirmPassword && (
							<span className="text-error">
								{errors.confirmPassword.message}
							</span>
						)}
					</Label>
					<Button
						variant="primary"
						shape="block"
						className={cn("mt-2", isPending ? "btn-disabled" : "")}
					>
						Sign Up
					</Button>
					<p>
						Already have an account?{" "}
						<NavLink to="/login" className="underline hover:text-primary">
							Login
						</NavLink>
					</p>
				</form>
			</CardContent>
		</Card>
	);
}

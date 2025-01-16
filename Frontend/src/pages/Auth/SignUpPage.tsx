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
import { NavLink, useNavigate } from "react-router";
import { useForm } from "../../../node_modules/react-hook-form/dist";
import { useState } from "react";
import { checkEmailToBeUnique, cn } from "../../lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from "../../types/auth";
import { PasswordInput } from "../../components/PasswordInput/PasswordInput";
import useRefinement from "../../hooks/useRefinement";

export default function SignUpPage() {
	const [isPending, setIsPending] = useState(false);
	const { signUp } = useSignUp();

	const uniqueEmail = useRefinement(checkEmailToBeUnique(), {
		debounce: 1000,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormData>({
		resolver: zodResolver(
			signUpSchema.refine(uniqueEmail, {
				message: "An account already exists for this email",
				path: ["email"],
			})
		),
		mode: "onSubmit",
	});
	const navigate = useNavigate();

	async function onSubmit(data: SignUpFormData) {
		setIsPending(true);
		try {
			await signUp?.create({
				emailAddress: data.email,
				password: data.password,
			});
			const response = await fetch(`/api/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: data.firstName,
					email: data.email,
				}),
			});

			if (!response.ok) throw new Error(`Response status: ${response.status}`);
			navigate("/home");
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
						<span className="sr-only">First Name</span>
						<Input
							{...register("firstName")}
							type="text"
							name="firstName"
							placeholder="First Name"
							className={errors.firstName && "input-error"}
						/>
						{errors.firstName && (
							<span className="text-error">{errors.firstName.message}</span>
						)}
					</Label>
					<Label className="p-0">
						<span className="sr-only">Email</span>
						<Input
							{...register("email", { onChange: uniqueEmail.invalidate })}
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
						<PasswordInput
							{...register("password")}
							name="password"
							placeholder="Password"
							className={errors.password && "input-error"}
						/>
						{errors.password && (
							<span className="text-error">{errors.password.message}</span>
						)}
					</Label>
					<Label className="relative p-0">
						<span className="sr-only">Confirm Password</span>
						<PasswordInput
							{...register("confirmPassword")}
							name="confirmPassword"
							placeholder="Confirm Password"
							className={errors.confirmPassword && "input-error"}
						/>
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
				</form>
				<p>
					Already have an account?{" "}
					<NavLink to="/login" className="underline hover:text-primary">
						Login
					</NavLink>
				</p>
			</CardContent>
		</Card>
	);
}

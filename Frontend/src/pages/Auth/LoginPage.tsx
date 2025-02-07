import { useClerk, useSignIn } from "@clerk/clerk-react";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "../../lib/utils";
import { PasswordInput } from "../../components/PasswordInput/PasswordInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type LoginFormData = {
	email: string;
	password: string;
};

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {
	const [isPending, setIsPending] = useState(false);
	const [signInError, setSignInError] = useState<string | null>(null);

	const navigate = useNavigate();

	const { signIn } = useSignIn();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const { setActive } = useClerk();

	async function onSubmit(data: LoginFormData) {
		setIsPending(true);
		setSignInError(null);

		try {
			const signInResult = await signIn?.create({
				identifier: data.email,
				strategy: "password",
				password: data.password,
			});

			if (!signInResult) {
				throw new Error("Sign in failed - no result returned");
			}

			if (signInResult.status === "complete") {
				await setActive({
					session: signInResult.createdSessionId,
				});
				navigate("/home");
			} else {
				setSignInError("Sign in could not be completed. Please try again.");
			}
		} catch (err) {
			const error = err as Error;
			console.error("Error signing in", error);

			if (error.message?.includes("Invalid email")) {
				setError("email", { message: "Invalid email address" });
			} else if (error.message?.includes("Invalid password")) {
				setError("password", { message: "Invalid password" });
			} else {
				setSignInError(
					"Failed to sign in. Please check your credentials and try again."
				);
			}
		} finally {
			setIsPending(false);
		}
	}

	return (
		<>
			<Card>
				<CardTitle className="mx-auto text-center">Welcome Back</CardTitle>
				<CardDescription>
					Enter your credentials to access your Pickle Pal account
				</CardDescription>
				<CardContent>
					<form
						className="flex flex-col gap-4 font-extrabold"
						onSubmit={handleSubmit(onSubmit)}
					>
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
						{signInError && (
							<div className="text-sm text-error">{signInError}</div>
						)}
						<Button
							variant="primary"
							shape="block"
							className={cn("mt-2", isPending ? "btn-disabled" : "")}
							disabled={isPending}
						>
							{isPending ? "Signing in..." : "Login"}
						</Button>
					</form>
					<p>
						Don&apos;t have an account yet?{" "}
						<NavLink to="/register" className="underline hover:text-primary">
							Signup
						</NavLink>
					</p>
				</CardContent>
			</Card>
		</>
	);
}

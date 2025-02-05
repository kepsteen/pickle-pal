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

type LoginFormData = {
	email: string;
	password: string;
};

export default function LoginPage() {
	const [isPending, setIsPending] = useState(false);

	const navigate = useNavigate();

	const { signIn } = useSignIn();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>();

	const { setActive } = useClerk();

	async function onSubmit(data: LoginFormData) {
		setIsPending(true);
		try {
			const signInResult = await signIn?.create({
				identifier: data.email,
				strategy: "password",
				password: data.password,
			});

			if (signInResult?.status === "complete") {
				// Need to set the active session so isSigned -> true
				await setActive({
					session: signInResult.createdSessionId,
				});
				navigate("/home");
			}
		} catch (error) {
			console.error("Error signing in", error);
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
						<Button
							variant="primary"
							shape="block"
							className={cn("mt-2", isPending ? "btn-disabled" : "")}
						>
							Login
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

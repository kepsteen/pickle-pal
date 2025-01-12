import { useSignUp } from "@clerk/clerk-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "../../components/Card/Card";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { NavLink } from "react-router";

export default function SignUpPage() {
	const { signUp } = useSignUp();

	async function handleSubmit(e: React.FormEvent, formData: FormData) {
		e.preventDefault();
		try {
			const email = formData.get("email") as string;
			const password = formData.get("password") as string;
			const result = await signUp?.create({ emailAddress: email, password });
			// Todo: Add Loading state
			alert(`Email: ${email}, Password: ${password}, Result: ${result}`);
		} catch (error) {
			console.error("Error signing up", error);
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
				<form
					className="flex flex-col gap-4"
					onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						handleSubmit(e, formData);
					}}
				>
					<Label className="p-0">
						<span className="sr-only">Email</span>
						<Input type="text" name="email" placeholder="Email" />
					</Label>
					<Label className="p-0">
						<span className="sr-only">Password</span>
						<Input type="password" name="password" placeholder="Password" />
					</Label>
					<Label className="p-0">
						<span className="sr-only">Confirm Password</span>
						<Input
							type="password"
							name="password"
							placeholder="Confirm Password"
						/>
					</Label>
					<Button variant="primary" shape="block" className="mt-2">
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

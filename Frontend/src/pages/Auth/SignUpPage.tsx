import { useSignUp } from "@clerk/clerk-react";

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
		<form
			onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);
				handleSubmit(e, formData);
			}}
		>
			<label htmlFor="">
				Email
				<input type="text" name="email" className="border border-black" />
			</label>
			<label htmlFor="">
				Password
				<input
					type="password"
					name="password"
					className="border border-black"
				/>
			</label>
			<label>
				Confirm Password
				<input
					type="password"
					name="confirm-password"
					className="border border-black"
				/>
			</label>
			<button className="p-2 border border-black">submit</button>
		</form>
	);
}

import { Card, CardContent, CardTitle } from "../../components/Card/Card";
import { Input } from "../../components/Input/Input";
import Label from "../../components/Label/Label";
import { ProfileImgInput } from "../../components/ProfileImgInput/ProfileImgInput";
import { Select } from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import { cn } from "../../lib/utils";
import { useForm } from "react-hook-form";
import { ProfileFormData } from "../../types/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../types/profileSchema";
import { DUPRRangeInput } from "../../components/DUPRRangeInput/DUPRRangeInput";
import { useAuth } from "@clerk/clerk-react";

type OnboardingPageProps = {
	isEditing: boolean;
};

export default function OnboardingPage({ isEditing }: OnboardingPageProps) {
	const { userId: clerkId } = useAuth();

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
	});

	async function onSubmit(data: ProfileFormData) {
		try {
			console.log("data", data);
			const response = await fetch(`/api/users/${clerkId}`, {
				method: "PATCH",
				headers: {
					"Content-type": "multipart/form-data",
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			const result = await response.json();
			console.log("result", result);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<Card className="bg-base-200">
				<CardTitle className="text-primary">
					{isEditing ? "Edit Profile" : "Create Profile"}
				</CardTitle>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<Label>
							Profile Image
							<ProfileImgInput
								{...register("profileImage")}
								name="profileImage"
							/>
							<span className="text-error">{errors.profileImage?.message}</span>
						</Label>
						<Label>
							Name
							<Input
								{...register("firstName")}
								className="bg-base-300"
								variant="accent"
							/>
							<span className="text-error">{errors.firstName?.message}</span>
						</Label>
						<Label>
							Skill Level
							<Select
								{...register("skillLevel")}
								size="sm"
								className="text-base-content/60"
								variant="accent"
							>
								<option value="beginner">Beginner</option>
								<option value="intermediate">Intermediate</option>
								<option value="Advanced">Advanced</option>
							</Select>
							<span className="text-error">{errors.skillLevel?.message}</span>
						</Label>
						<Label>
							Playstyle
							<Select
								{...register("playStyle")}
								size="sm"
								className="text-base-content/60"
								variant="accent"
							>
								<option value="dinker">Dinker</option>
								<option value="hybrid">Hybrid</option>
								<option value="banger">Banger</option>
							</Select>
							<span className="text-error">{errors.playStyle?.message}</span>
						</Label>
						<Label className="space-y-2">
							Looking for
							<div className="flex flex-wrap gap-4 text-sm font-normal">
								<label className="flex items-center gap-2">
									<input
										{...register("lookingFor.casual")}
										type="checkbox"
										value="true"
										className="checkbox checkbox-primary border-accent"
									/>
									<span>Casual Games</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										{...register("lookingFor.competitive")}
										type="checkbox"
										value="true"
										className="checkbox checkbox-primary border-accent"
									/>
									<span>Competitive</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										{...register("lookingFor.friends")}
										type="checkbox"
										value="true"
										className="checkbox checkbox-primary border-accent"
									/>
									<span>Friends</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										{...register("lookingFor.drilling")}
										type="checkbox"
										value="true"
										className="checkbox checkbox-primary border-accent"
									/>
									<span>Drilling</span>
								</label>
							</div>
							<span className="text-error">{errors.lookingFor?.message}</span>
						</Label>
						<Label>
							DUPR Rating
							<DUPRRangeInput {...register("duprRating")} />
							<span className="text-error">{errors.duprRating?.message}</span>
						</Label>
						<Label>
							<textarea
								{...register("bio")}
								className="h-24 textarea textarea-accent"
								placeholder="Bio"
							/>
							<span className="text-error">{errors.bio?.message}</span>
						</Label>
						<div
							className={cn(
								"flex",
								isEditing ? "justify-between" : "justify-end"
							)}
						>
							{isEditing && <Button variant="neutral">Cancel</Button>}
							<Button>{isEditing ? "Update Profile" : "Create Profile"}</Button>
						</div>
					</form>
					<button
						onClick={() => {
							console.log("Current form values:", getValues());
							console.log(
								"Specific profileImage value:",
								getValues("profileImage")
							);
						}}
					>
						get values
					</button>
				</CardContent>
			</Card>
		</>
	);
}

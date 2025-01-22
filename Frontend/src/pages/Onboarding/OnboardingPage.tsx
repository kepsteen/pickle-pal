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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

type OnboardingPageProps = {
	isEditing: boolean;
};

export default function OnboardingPage({ isEditing }: OnboardingPageProps) {
	const [selectedImage, setSelectedImage] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const { userId: clerkId, isLoaded } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoaded) {
			setIsLoading(false);
		}
	}, [clerkId, isLoaded]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: "",
			skillLevel: "Beginner",
			playStyle: "Hybrid",
			duprRating: 2,
			bio: "",
		},
	});

	async function onSubmit(data: ProfileFormData) {
		try {
			const formData = new FormData();

			// Append the file if it exists
			if (data.profileImage?.[0]) {
				formData.append("profileImage", data.profileImage[0]);
			}

			// Transform lookingFor object into array
			const lookingForArray = Object.entries(data.lookingFor)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				.filter(([_, checked]) => checked)
				.map(([key]) => key);

			// Append other form fields
			formData.append("firstName", data.firstName);
			formData.append("skillLevel", data.skillLevel);
			formData.append("playStyle", data.playStyle);
			formData.append("duprRating", data.duprRating.toString());
			formData.append("bio", data.bio);
			formData.append("lookingFor", JSON.stringify(lookingForArray));

			const response = await fetch(`/api/users/${clerkId}`, {
				method: "PATCH",
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			navigate("/home");
		} catch (error) {
			console.error(error);
		}
	}

	if (isLoading) {
		return <div>Loading...</div>; // Or your preferred loading component
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
								onChange={(e) => {
									const file = e.target.files?.[0];
									setSelectedImage(file ? URL.createObjectURL(file) : "");
								}}
								preview={selectedImage}
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
								<option value="Beginner">Beginner</option>
								<option value="Intermediate">Intermediate</option>
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
								<option value="Dinker">Dinker</option>
								<option value="Hybrid">Hybrid</option>
								<option value="Banger">Banger</option>
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
										id="casual-checkbox"
										className="checkbox checkbox-primary border-accent"
									/>
									<span>Casual Games</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										{...register("lookingFor.competitive")}
										type="checkbox"
										id="competitive-checkbox"
										className="checkbox checkbox-primary border-accent"
									/>
									<span>Competitive</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										{...register("lookingFor.friends")}
										type="checkbox"
										id="friends-checkbox"
										className="checkbox checkbox-primary border-accent"
									/>
									<span>Friends</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										{...register("lookingFor.drilling")}
										type="checkbox"
										id="drilling-checkbox"
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
				</CardContent>
			</Card>
		</>
	);
}

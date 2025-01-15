import { Card, CardContent, CardTitle } from "../components/Card/Card";
import { Input } from "../components/Input/Input";
import Label from "../components/Label/Label";
import ProfileImgInput from "../components/ProfileImgInput/ProfileImageInput";
import RangeInput from "../components/DUPRRangeInput/DUPRRangeInput";
import { Select } from "../components/Select/Select";
import Button from "../components/Button/Button";
import { cn } from "../lib/utils";

type OnboardingPageProps = {
	isEditing: boolean;
};

export default function OnboardingPage({ isEditing }: OnboardingPageProps) {
	return (
		<>
			<Card className="bg-base-200">
				<CardTitle className="text-primary">
					{isEditing ? "Edit Profile" : "Create Profile"}
				</CardTitle>
				<CardContent>
					<form action="" className="flex flex-col gap-4">
						<Label>
							Profile Image
							<ProfileImgInput />
						</Label>
						<Label>
							Name
							<Input
								name="firstName"
								className="bg-base-300"
								variant="accent"
							/>
						</Label>
						<Label>
							Skill Level
							<Select
								name="skillLevel"
								size="sm"
								className="text-base-content/60"
								variant="accent"
							>
								<option value="beginner">Beginner</option>
								<option value="intermediate">Intermediate</option>
								<option value="Advanced">Advanced</option>
							</Select>
						</Label>
						<Label>
							Playstyle
							<Select
								name="playStyle"
								size="sm"
								className="text-base-content/60"
								variant="accent"
							>
								<option value="dinker">Dinker</option>
								<option value="hybrid">Hybrid</option>
								<option value="banger">Banger</option>
							</Select>
						</Label>
						<Label className="space-y-2">
							Looking for
							<div className="flex flex-wrap gap-4 text-sm font-normal">
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										name="lookingFor"
										value="casual"
										className="checkbox checkbox-primary border-accent"
									/>
									<span>Casual Games</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										name="lookingFor"
										value="competitive"
										className="checkbox checkbox-primary border-accent"
									/>
									<span>Competitive</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										name="lookingFor"
										value="friends"
										className="checkbox checkbox-primary border-accent"
									/>
									<span>Friends</span>
								</label>
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										name="lookingFor"
										value="drilling"
										className="checkbox checkbox-primary border-accent"
									/>
									<span>Drilling</span>
								</label>
							</div>
						</Label>
						<Label>
							DUPR Rating
							<RangeInput />
						</Label>
						<Label>
							<textarea
								className="h-24 textarea textarea-accent"
								placeholder="Bio"
							/>
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

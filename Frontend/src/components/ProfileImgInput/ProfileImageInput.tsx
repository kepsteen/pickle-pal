import { ImagePlus } from "lucide-react";
import { Input } from "../Input/Input";

export default function ProfileImgInput() {
	return (
		<div className="relative">
			<Input
				name="profileImgInput"
				type="file"
				className="w-full opacity-0 h-72"
			/>
			<div className="absolute inset-0 grid border cursor-pointer place-content-center bg-base-300 rounded-box border-accent">
				<ImagePlus className="w-10 h-10 text-primary" />
			</div>
		</div>
	);
}

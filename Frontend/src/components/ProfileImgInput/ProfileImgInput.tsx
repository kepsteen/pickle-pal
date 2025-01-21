import { ImagePlus } from "lucide-react";
import { forwardRef } from "react";

// export default function ProfileImgInput() {
// 	return (
// 		<div className="relative">
// 			<input
// 				name="profileImgInput"
// 				type="file"
// 				className="w-full opacity-0 h-72"
// 			/>
// 			<div className="absolute inset-0 grid border cursor-pointer place-content-center bg-base-300 rounded-box border-accent">
// 				<ImagePlus className="w-10 h-10 text-primary" />
// 			</div>
// 		</div>
// 	);
// }

type ProfileImgInputProps = {
	name: string;
	preview?: string;
	onImageUpload?: (file: File) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const ProfileImgInput = forwardRef<
	HTMLInputElement,
	ProfileImgInputProps
>(({ name, preview, onImageUpload, ...props }, ref) => {
	return (
		<div className="relative">
			<input
				{...props}
				ref={ref}
				accept="image/*"
				name={name}
				type="file"
				className="w-full opacity-0 h-72"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file && onImageUpload) {
						onImageUpload(file);
					}
					props.onChange?.(e);
				}}
			/>
			<div className="absolute inset-0 grid object-cover overflow-hidden border cursor-pointer place-content-center bg-base-300 rounded-box border-accent">
				{preview ? (
					<img
						src={preview}
						alt="Profile preview"
						className="object-cover w-full h-full rounded-box"
					/>
				) : (
					<ImagePlus className="w-10 h-10 text-primary" />
				)}
			</div>
		</div>
	);
});

// Add proper type for the props
ProfileImgInput.displayName = "ProfileImgInput";

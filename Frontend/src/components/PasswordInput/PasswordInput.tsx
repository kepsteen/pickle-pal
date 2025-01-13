import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Input } from "../Input/Input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

// Extend from the same props as Input component
interface PasswordInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	className?: string;
	name: string;
	variant?:
		| "primary"
		| "secondary"
		| "accent"
		| "info"
		| "success"
		| "warning"
		| "error";
	size?: "xs" | "sm" | "md" | "lg";
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
	({ className, ...props }, ref) => {
		const [showPassword, setShowPassword] = useState(false);

		return (
			<div className="relative w-full">
				<Input
					{...props}
					ref={ref}
					type={showPassword ? "text" : "password"}
					className={cn(className)}
				/>
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className="absolute -translate-y-1/2 right-3 top-1/2"
				>
					{showPassword ? (
						<EyeOff className="text-base-content/60" />
					) : (
						<Eye className="text-base-content/60" />
					)}
				</button>
			</div>
		);
	}
);

PasswordInput.displayName = "PasswordInput";

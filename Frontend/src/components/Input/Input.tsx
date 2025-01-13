import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface InputProps
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

const variants = {
	primary: "input-primary",
	secondary: "input-secondary",
	accent: "input-accent",
	info: "input-info",
	success: "input-success",
	warning: "input-warning",
	error: "input-error",
};

const sizes = {
	xs: "input-xs",
	sm: "input-sm",
	md: "input-md",
	lg: "input-lg",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, variant = "primary", size = "sm", name, ...props }, ref) => {
		return (
			<input
				{...props}
				ref={ref}
				name={name}
				className={cn(
					"input w-full",
					variants[variant],
					sizes[size],
					className
				)}
			/>
		);
	}
);

Input.displayName = "Input";

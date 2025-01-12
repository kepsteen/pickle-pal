import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface InputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	children?: ReactNode;
	className?: string;
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

export default function Input({
	children,
	className,
	variant = "primary",
	size = "sm",
	...props
}: InputProps) {
	return (
		<input
			{...props}
			className={cn("input w-full", variants[variant], sizes[size], className)}
		>
			{children}
		</input>
	);
}

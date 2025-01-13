import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
	className?: string;
	variant?:
		| "primary"
		| "secondary"
		| "accent"
		| "info"
		| "success"
		| "warning"
		| "error"
		| "neutral"
		| "ghost"
		| "link"
		| "outline";
	shape?: "wide" | "block" | "circle" | "square" | "";
	size?: "xs" | "sm" | "md" | "lg";
}

const variants = {
	primary: "btn-primary",
	secondary: "btn-secondary",
	accent: "btn-accent",
	info: "btn-info",
	success: "btn-success",
	warning: "btn-warning",
	error: "btn-error",
	neutral: "btn-neutral",
	link: "btn-link",
	ghost: "btn-ghost",
	outline: "btn-outline",
};

const sizes = {
	xs: "btn-xs",
	sm: "btn-sm",
	md: "btn-md",
	lg: "btn-lg",
};

const shapes = {
	wide: "btn-wide",
	block: "btn-block",
	circle: "btn-circle",
	square: "btn-square",
};

export default function Button({
	children,
	className,
	variant = "primary",
	size = "sm",
	shape = "",
	...props
}: ButtonProps) {
	return (
		<button
			{...props}
			className={cn(
				"btn",
				variants[variant],
				sizes[size],
				shapes[shape as keyof typeof shapes],
				className
			)}
		>
			{children}
		</button>
	);
}

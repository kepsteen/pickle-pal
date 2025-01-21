import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
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
	size?: "xs" | "sm" | "md" | "lg";
}

const variants = {
	primary: "badge-primary",
	secondary: "badge-secondary",
	accent: "badge-accent",
	info: "badge-info",
	success: "badge-success",
	warning: "badge-warning",
	error: "badge-error",
	neutral: "badge-neutral",
	link: "badge-link",
	ghost: "badge-ghost",
	outline: "border border-primary text-primary",
};

const sizes = {
	xs: "badge-xs",
	sm: "badge-sm",
	md: "badge-md",
	lg: "badge-lg",
};

export const Badge = ({
	children,
	className,
	variant = "primary",
	size = "sm",
	...props
}: BadgeProps) => {
	return (
		<div
			className={cn("badge", variants[variant], sizes[size], className)}
			{...props}
		>
			{children}
		</div>
	);
};

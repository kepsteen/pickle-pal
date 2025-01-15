import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface SelectProps
	extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
	className?: string;
	name: string;
	size?: "sm" | "md" | "lg" | "xs";
	variant?:
		| "primary"
		| "secondary"
		| "accent"
		| "info"
		| "success"
		| "warning"
		| "error";
}

const sizes = {
	xs: "select-xs",
	sm: "select-sm",
	md: "select-md",
	lg: "select-lg",
};

const variants = {
	primary: "select-primary",
	secondary: "select-secondary",
	accent: "select-accent",
	info: "select-info",
	success: "select-success",
	warning: "select-warning",
	error: "select-error",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ className, name, size = "md", variant = "primary", ...props }, ref) => {
		return (
			<select
				{...props}
				ref={ref}
				className={cn(
					"select",
					sizes[size],
					variants[variant],
					"[&>option:hover]:bg-primary [&>option:hover]:text-primary-content",
					className
				)}
				name={name}
			/>
		);
	}
);

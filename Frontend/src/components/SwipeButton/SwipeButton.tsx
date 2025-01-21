import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Check, X } from "lucide-react";

interface SwipeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
	className?: string;
	variant?: "like" | "dislike";
}

const variants = {
	like: "btn-primary",
	dislike: "bg-black border-black",
};

export default function SwipeButton({
	children,
	className,
	variant = "like",
	...props
}: SwipeButtonProps) {
	return (
		<button
			{...props}
			className={cn("btn btn-square btn-lg p-1", variants[variant], className)}
		>
			{variant === "like" ? <Check size={44} /> : <X size={44} />}
			{children}
		</button>
	);
}

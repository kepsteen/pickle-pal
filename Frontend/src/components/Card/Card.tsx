import { ReactNode } from "react";
import { cn } from "../../lib/utils";

type CardProps = {
	children?: ReactNode;
	className?: string;
};

export const CardTitle = ({ children, className }: CardProps) => {
	return <h3 className={cn("card-title px-8 pt-8", className)}>{children}</h3>;
};

export const CardDescription = ({ children, className }: CardProps) => {
	return (
		<p className={cn("text-base-content/60 px-8", className)}>{children}</p>
	);
};

export const CardContent = ({ children, className }: CardProps) => {
	return <div className={cn("card-body", className)}>{children}</div>;
};

export const Card = ({ children, className }: CardProps) => {
	return <div className={cn("card", className)}>{children}</div>;
};

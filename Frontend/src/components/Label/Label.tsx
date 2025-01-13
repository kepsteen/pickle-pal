import { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
	children?: ReactNode;
	className?: string;
};

export default function Label({ children, className, ...props }: LabelProps) {
	return (
		<label {...props} className={cn("label w-full flex flex-col", className)}>
			{children}
		</label>
	);
}

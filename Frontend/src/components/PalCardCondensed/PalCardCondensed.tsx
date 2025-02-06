import { NavLink } from "react-router";
import { cn } from "../../lib/utils";

type PalCardCondensedProps = {
	palId: string;
	name: string;
	imageUrl: string;
	className?: string;
};

export default function PalCardCondensed({
	palId,
	name,
	imageUrl,
	className,
}: PalCardCondensedProps) {
	return (
		<NavLink to={`/pals/${palId}`}>
			<article
				className={cn(
					"relative flex items-center justify-start gap-8 px-6 py-6 rounded-lg bg-base-200 hover:bg-base-300 transition-colors ease-in-out duration-300",
					className
				)}
			>
				<div className="avatar">
					<div className="w-10 rounded-full ring-primary ring-offset-base-100 ring ring-offset-2">
						<img src={imageUrl} />
					</div>
				</div>
				<span className="text-2xl font-semibold text-base-content">{name}</span>
			</article>
		</NavLink>
	);
}

import { NavLink } from "react-router";

type PalCardCondensedProps = {
	palId: string;
	name: string;
	imageUrl: string;
};

export default function PalCardCondensed({
	palId,
	name,
	imageUrl,
}: PalCardCondensedProps) {
	return (
		<NavLink to={`/pals/${palId}`}>
			<article className="relative flex items-center justify-start gap-8 px-12 py-8 rounded-lg bg-base-200 w-96">
				<div className="avatar">
					<div className="w-16 rounded-full ring-primary ring-offset-base-100 ring ring-offset-2">
						<img src={imageUrl} />
					</div>
				</div>
				<span className="text-2xl font-semibold text-base-content">{name}</span>
			</article>
		</NavLink>
	);
}

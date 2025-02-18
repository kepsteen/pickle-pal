import { Avatar } from "../Avatar/Avatar";

type MatchToastProps = {
	name: string;
	imageUrl: string;
};

export const MatchToast = ({ name, imageUrl }: MatchToastProps) => {
	return (
		<div className="relative flex items-center justify-start w-full gap-4">
			<Avatar imageUrl={imageUrl} />
			<span className="text-xl font-semibold text-base-content">{name}</span>
			<span className="absolute text-lg -top-2 -right-1 text-primary">
				New Pal!
			</span>
		</div>
	);
};

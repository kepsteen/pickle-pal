import { Avatar } from "../Avatar/Avatar";

type MatchToastProps = {
	name: string;
};

export const MatchToast = ({ name }: MatchToastProps) => {
	return (
		<div className="relative flex items-center justify-start w-full gap-4">
			<Avatar />
			<span className="text-xl font-semibold text-base-content">{name}</span>
			<span className="absolute text-lg -top-2 -right-1 text-primary">
				New Pal!
			</span>
		</div>
	);
};

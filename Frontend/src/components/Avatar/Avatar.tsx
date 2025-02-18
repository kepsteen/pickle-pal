interface AvatarProps {
	imageUrl: string;
}

export const Avatar = ({ imageUrl }: AvatarProps) => {
	return (
		<div className="avatar">
			<div className="w-10 rounded-full ring-primary ring-offset-base-100 ring ring-offset-2">
				<img src={imageUrl} />
			</div>
		</div>
	);
};

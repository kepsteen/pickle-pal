import { useState } from "react";
import { NavLink } from "react-router";

interface Notification {
	id: string;
	message: string;
	read: boolean;
	timestamp: string;
	type: "message" | "match" | "pair-swipe-invite";
}

const notificationsData: Notification[] = [
	{
		id: "1",
		message: "You have a new message",
		type: "message",
		read: false,
		timestamp: "2024-01-15T10:30:00Z",
	},
	{
		id: "2",
		message: "John liked your profile",
		type: "match",
		read: false,
		timestamp: "2024-01-15T09:45:00Z",
	},
	{
		id: "3",
		message: "New pair match available",
		type: "match",
		read: true,
		timestamp: "2024-01-14T18:20:00Z",
	},
	{
		id: "4",
		message: "Sarah wants to play doubles",
		type: "pair-swipe-invite",
		read: false,
		timestamp: "2024-01-14T15:10:00Z",
	},
];

const InviteLink = () => {
	return <NavLink to="/pair-swipe">Join Session</NavLink>;
};

const MessageLink = () => {
	return <NavLink to="/pals">View Message</NavLink>;
};

export default function NotificationsPage() {
	const [notifications, setNotifications] =
		useState<Notification[]>(notificationsData);

	const renderNotificationAction = (type: Notification["type"]) => {
		switch (type) {
			case "message":
				return <MessageLink />;
			case "match":
				return <MessageLink />;
			case "pair-swipe-invite":
				return <InviteLink />;
		}
	};
	const handleNotificationClick = (id: string) => {
		setNotifications(
			notifications.map((notification) =>
				notification.id === id ? { ...notification, read: true } : notification
			)
		);
	};
	return (
		<main className="flex flex-col w-screen py-4 lg:py-10 h-main-content container-padding">
			<h1 className="mx-auto mb-10 text-4xl font-semibold text-base-content">
				Notifications
			</h1>
			<ul className="flex flex-col w-full max-w-[350px] h-full gap-2 mx-auto overflow-y-auto">
				<p className="sr-only">Notifications List</p>
				{notifications.map((notification) => (
					<li
						key={notification.id}
						className={`p-4 rounded-lg cursor-pointer ${
							notification.read ? "bg-base-200" : "bg-neutral"
						}`}
						onClick={() => handleNotificationClick(notification.id)}
					>
						<p
							className={
								notification.read
									? "text-base-content"
									: "font-medium text-base-content"
							}
						>
							{notification.message}
						</p>
						{renderNotificationAction(notification.type)}
					</li>
				))}
			</ul>
		</main>
	);
}

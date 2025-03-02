import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Card, CardContent, CardTitle } from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { NavLink } from "react-router";
import { ProfileData } from "../../types/user.types";

export default function SettingsPage() {
	const { user } = useUser();
	const { getToken, signOut } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [profileData, setProfileData] = useState<ProfileData | null>(null);

	// Fetch user profile data
	useEffect(() => {
		const fetchUserProfile = async () => {
			if (!user) return;

			try {
				setIsLoading(true);
				const response = await fetch(`/api/users/${user.id}/profile`, {
					headers: {
						Authorization: `Bearer ${await getToken()}`,
					},
				});

				if (!response.ok) {
					throw new Error("Failed to fetch profile data");
				}

				const data = await response.json();
				setProfileData(data);
			} catch (error) {
				console.error("Error fetching profile:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserProfile();
	}, [user, getToken]);

	// Handle logout
	const handleLogout = async () => {
		try {
			await signOut();
			// Clerk will redirect to the afterSignOutUrl specified in ClerkProvider
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<main className="flex w-screen h-main-content container-padding">
			<div className="w-full max-w-3xl mx-auto">
				<h1 className="mb-6 text-4xl font-semibold text-center text-base-content">
					Settings
				</h1>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{/* Profile Information */}
					<Card className="h-fit">
						<CardTitle className="p-4 border-b border-base-300">
							Profile Information
						</CardTitle>
						<CardContent className="p-4">
							{isLoading ? (
								<div className="flex justify-center">
									<span className="loading loading-spinner loading-md text-primary"></span>
								</div>
							) : profileData ? (
								<div className="flex gap-4">
									<div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-full bg-base-300">
										{profileData.profileImageUrl ? (
											<img
												src={profileData.profileImageUrl}
												alt="Profile"
												className="object-cover w-full h-full"
											/>
										) : (
											<div className="flex items-center justify-center w-full h-full text-2xl text-base-content">
												{profileData.firstName?.charAt(0) ||
													user?.firstName?.charAt(0) ||
													"?"}
											</div>
										)}
									</div>
									<div className="flex-1">
										<h2 className="text-xl font-bold">
											{profileData.firstName || user?.firstName}
										</h2>
										<p className="text-sm text-muted">
											{user?.emailAddresses[0]?.emailAddress}
										</p>
										<div className="grid grid-cols-2 gap-2 mt-2 text-sm">
											<div>
												<span className="text-muted">Skill: </span>
												<span>{profileData.skillLevel || "Not set"}</span>
											</div>
											<div>
												<span className="text-muted">Style: </span>
												<span>{profileData.playStyle || "Not set"}</span>
											</div>
											<div>
												<span className="text-muted">DUPR: </span>
												<span>{profileData.duprRating || "Not set"}</span>
											</div>
										</div>
										<div className="mt-3">
											<NavLink to="/onboarding" className="inline-block">
												<Button variant="primary" size="xs">
													Edit Profile
												</Button>
											</NavLink>
										</div>
									</div>
								</div>
							) : (
								<div>
									<p className="mb-2 text-sm">
										No profile information available
									</p>
									<NavLink to="/onboarding" className="inline-block">
										<Button variant="primary" size="xs">
											Create Profile
										</Button>
									</NavLink>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Sign Out */}
					<Card className="h-fit">
						<CardTitle className="p-4 border-b border-base-300">
							Account
						</CardTitle>
						<CardContent className="p-4">
							<div>
								<h3 className="mb-1 text-lg font-medium">Sign Out</h3>
								<p className="mb-3 text-sm text-muted">
									Sign out of your account on this device.
								</p>
								<Button variant="error" size="xs" onClick={handleLogout}>
									Sign Out
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}

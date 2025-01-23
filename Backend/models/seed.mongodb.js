// Connect to database
// Seed data
const users = [
	{
		email: "sarah.smith@email.com",
		firstName: "Sarah",
		userId: "user_001",
		skillLevel: "Intermediate",
		playStyle: "Hybrid",
		duprRating: 4.5,
		bio: "Looking for regular drilling partners to improve my game",
		lookingFor: ["drilling", "competitive"],
		profileImageUrl:
			"https://pickleballunion.com/wp-content/uploads/2022/11/how-to-become-a-pro-pickleball-player.jpg",
	},
	{
		email: "mike.johnson@email.com",
		firstName: "Mike",
		userId: "user_002",
		skillLevel: "Advanced",
		playStyle: "Banger",
		duprRating: 6.0,
		bio: "Tournament player seeking competitive matches",
		lookingFor: ["competitive", "drilling"],
		profileImageUrl:
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4WivGb5oXjbdQgsQ8p-8gqSmSsCFz8eKbW0imqXtXMKB4Om87M_MGznELB9164p9iFbU&usqp=CAU",
	},
	{
		email: "lisa.chen@email.com",
		firstName: "Lisa",
		userId: "user_003",
		skillLevel: "Beginner",
		playStyle: "Dinker",
		duprRating: 3.0,
		bio: "New to pickleball and loving it! Looking for friendly matches",
		lookingFor: ["casual", "friends"],
		profileImageUrl:
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLlLDz7Ek2O1Xu3HnZIq5x678Vp7_GBUCQqQ&s",
	},
	{
		email: "david.park@email.com",
		firstName: "David",
		userId: "user_004",
		skillLevel: "Intermediate",
		playStyle: "Hybrid",
		duprRating: 4.0,
		bio: "Weekend warrior looking for regular games",
		lookingFor: ["casual", "friends", "competitive"],
		profileImageUrl:
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTooAlrTEAZxXU8-zIJOm-S4dYxH3xLWjNA_Q&s",
	},
	{
		email: "emma.wilson@email.com",
		firstName: "Emma",
		userId: "user_005",
		skillLevel: "Advanced",
		playStyle: "Dinker",
		duprRating: 5.5,
		bio: "Strategy-focused player looking to improve",
		lookingFor: ["drilling", "competitive", "friends"],
		profileImageUrl:
			"https://pickleballunion.com/wp-content/uploads/2024/05/Things-That-Drive-Pickleball-Players-Crazy.jpg",
	},
];

// Insert users
db.users.insertMany(users);

// Verify insertion
print(`Inserted ${db.users.count()} users`);

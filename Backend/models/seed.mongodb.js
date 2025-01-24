// Connect to database
// Seed data
// Connect to your database

// Create a 2dsphere index if not already exists
db.locations.createIndex({ location: "2dsphere" });

// Insert some test locations
// Find locations within 5 miles of user1
db.locations
	.find({
		location: {
			$near: {
				$geometry: {
					type: "Point",
					coordinates: [-117.81725786217626, 33.63195770533891], // user1's location
				},
				$maxDistance: 5 * 1609.34, // 5 miles in meters
			},
		},
		userId: { $ne: "user1" },
	})
	.pretty();

db.locations
	.aggregate([
		{
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [-117.81718056793409, 33.63192433547874], // user1's location
				},
				distanceField: "distance",
				spherical: true,
				distanceMultiplier: 0.000621371, // Convert meters to miles
				query: { userId: { $ne: "user1" } },
			},
		},
		{
			$project: {
				userId: 1,
				distanceInMiles: { $round: ["$distance", 2] },
			},
		},
	])
	.forEach((doc) => {
		print(`User ${doc.userId} is ${doc.distanceInMiles} miles away`);
	});

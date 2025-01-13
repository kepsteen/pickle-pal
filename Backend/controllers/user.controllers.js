import User from "../models/user.model.js";

export const createUser = async (req, res) => {
	try {
		const { email, firstName } = req.body;
		// Todo: Add error handling
		const newProfile = await User.create({ email, firstName });
		res.status(201).json(newProfile);
	} catch (error) {
		res.status(500).json({ error: "Failed to create profile" });
	}
};

export const verifyEmailExists = async (req, res) => {
	try {
		const { email } = req.params;
		const profile = await User.find({ email });
		if (profile.length !== 0) {
			return res.status(200).json({ uniqueEmail: false });
		}

		return res.status(200).json({ uniqueEmail: true });
	} catch (error) {
		res.status(500).json({ error: "Error checking email existence" });
	}
};

const User = require("../models/userModel");
const cache = require("../utils/cache");

exports.getUserProfile = async (req, res) => {
  try {
    const cacheKey = `user-${req.user.id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    cache.set(cacheKey, user, 60);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

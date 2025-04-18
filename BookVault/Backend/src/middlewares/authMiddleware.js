const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "Access Denied" });

  try {
    // Extract the token from the "Bearer [token]" format
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified Token:", verified);
    req.user = verified;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(400).json({ message: "Invalid Token" });
  }
};
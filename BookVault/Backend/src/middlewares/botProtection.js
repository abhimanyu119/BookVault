module.exports = (req, res, next) => {
  const userAgent = req.headers["user-agent"];
  if (!userAgent || userAgent.includes("bot")) {
    return res.status(403).json({ error: "Bots are not allowed" });
  }
  next();
};
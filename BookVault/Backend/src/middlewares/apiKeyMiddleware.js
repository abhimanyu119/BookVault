module.exports = (req, res, next) => {
  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }
  next();
};
const cors = require("cors");

const allowedOrigins = [process.env.FRONTEND_URL];

module.exports = cors({
  origin: allowedOrigins,
  credentials: true,
});
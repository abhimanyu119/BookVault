require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const rateLimit = require("./middlewares/rateLimit");
const botProtection = require("./middlewares/botProtection");

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
  process.env.FRONTEND_URL.trim(),
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(204);
});

app.use(express.json());
app.use(logger);
app.use(rateLimit);
app.use(botProtection);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
require("dotenv").config();
const express = require("express");
const cors = require("./config/cors");
const logger = require("./utils/logger");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const rateLimit = require("./middlewares/rateLimit");
const botProtection = require("./middlewares/botProtection");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors);
app.use(logger);
app.use(rateLimit);
app.use(botProtection);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
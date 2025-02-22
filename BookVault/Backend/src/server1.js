require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const AWS = require("aws-sdk");
const AmazonDaxClient = require("amazon-dax-client");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT ;
const SECRET_KEY = process.env.JWT_SECRET;
const API_KEY = process.env.API_KEY;
const cache = new NodeCache({ stdTTL: 60 });

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

const dax = new AmazonDaxClient({
  endpoints: [process.env.DAX_ENDPOINT],
  region: process.env.AWS_REGION,
});
const dynamoDB = new AWS.DynamoDB.DocumentClient({ service: dax });
const USERS_TABLE = process.env.USERS_TABLE;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, try again later." },
});
app.use(limiter);

app.use((req, res, next) => {
  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }
  next();
});

app.use((req, res, next) => {
  const userAgent = req.headers["user-agent"];
  if (!userAgent || userAgent.includes("bot")) {
    return res.status(403).json({ error: "Bots are not allowed" });
  }
  next();
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const userCheck = await dynamoDB
      .get({ TableName: USERS_TABLE, Key: { email } })
      .promise();
    if (userCheck.Item)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword, role: "user" };
    await dynamoDB.put({ TableName: USERS_TABLE, Item: newUser }).promise();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const userData = await dynamoDB
      .get({ TableName: USERS_TABLE, Key: { email } })
      .promise();
    if (
      !userData.Item ||
      !(await bcrypt.compare(password, userData.Item.password))
    ) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: email, role: userData.Item.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/dashboard", authenticate, async (req, res) => {
  const cacheKey = `dashboard-${req.user.id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);

  const userData = await dynamoDB
    .get({ TableName: USERS_TABLE, Key: { email: req.user.id } })
    .promise();
  cache.set(cacheKey, userData, 60);
  res.json(userData);
});

app.use((req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.ip} - ${req.method} ${
    req.url
  }\n`;
  fs.appendFileSync("requests.log", log);
  next();
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
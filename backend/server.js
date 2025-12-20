const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// CORS middleware with frontend URL from environment
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:4000",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:4000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

const quizRoutes = require("./routes/quizRoutes");
app.use("/api/quiz", quizRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

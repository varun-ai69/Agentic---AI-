const express = require("express");
const dotenv = require("dotenv");
 const { initDb, isDbConfigured } = require("./db");

dotenv.config();

const app = express();


app.use(express.json());


const quizRoutes = require("./routes/quizRoutes");
app.use("/api/quiz", quizRoutes);


const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const enableAuth = String(process.env.ENABLE_AUTH || "").toLowerCase() === "true";
    const hasJwtSecret = Boolean(process.env.JWT_SECRET);

    if (enableAuth && hasJwtSecret && isDbConfigured()) {
      await initDb();
      const authRoutes = require("./routes/authRoutes");
      app.use("/api/auth", authRoutes);
      console.log("✅ Auth enabled");
    } else {
      console.log("ℹ️ Auth disabled (free access mode)");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();

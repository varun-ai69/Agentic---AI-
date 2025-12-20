const express = require("express");
const dotenv = require("dotenv");
 const { initDb } = require("./db");

dotenv.config();

const app = express();


app.use(express.json());


 const authRoutes = require("./routes/authRoutes");
 app.use("/api/auth", authRoutes);

const quizRoutes = require("./routes/quizRoutes");
app.use("/api/quiz", quizRoutes);


const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();

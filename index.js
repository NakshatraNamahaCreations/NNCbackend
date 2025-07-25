const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const blogRoutes = require('./routes/blogRoutes');
const personRoutes = require('./routes/personRoutes');

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use('/blogs', blogRoutes);
app.use('/api/persons', personRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

connectDB();

mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose connected to the database.");
});
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected.");
});

const uploadDir = path.join(__dirname, "uploads");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
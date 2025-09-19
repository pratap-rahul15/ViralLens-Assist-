const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const chatRoutes = require("./routes/chat");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);

// DB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;

    // Try to start the server
    const server = app.listen(PORT, () =>

      console.log(`🚀 Server running on port ${PORT}`)
    );

   
    server.on("error", (err) => {

      if (err.code === "EADDRINUSE") {

        console.error(` Port ${PORT} already in use. Trying another...`);

        const newPort = Number(PORT) + 1;

        app.listen(newPort, () =>

          console.log(` Server running on port ${newPort}`)
        );
      } else {
        console.error(" Server error:", err);
      }

    });

  })
  
  .catch((err) => console.error(" MongoDB connection error:", err));

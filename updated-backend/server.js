const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const profileRoutes = require("./routes/Users/profileRoutes");
const otpController = require("./controllers/otpControllerpartner");
const otpRoutes = require("./routes/partner/otpRoutes");
const partnerRoutes = require("./routes/partner/partnerRoutes");
const schoolRoutes = require("./routes/School/schoolRoutes");
const instructorRoutes = require("./routes/instructor/instructorRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

// Routes
app.use("/sendOtp", otpControllerpartner.sendOtp);
app.use("/verifyOtp", otpControllerpartner.verifyOtp);
app.use("/submit-details", otpControllerpartner.submitDetails);
app.use("/api/profile", profileRoutes);
app.use("/api/otp", otpRoutes);
app.use("/partner", partnerRoutes);
app.use("/school", schoolRoutes);
app.use("/instructor", instructorRoutes);

// Real-time location update handling with socket.io
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Listen for location updates from instructors
  socket.on("locationUpdate", async (data) => {
    const { instructorId, latitude, longitude } = data;

    // Update instructor's location in the database
    await Instructor.findOneAndUpdate(
      { instructorId },
      { "location.latitude": latitude, "location.longitude": longitude }
    );

    // Save the location in Location history
    const newLocation = new Location({ instructorId, latitude, longitude });
    await newLocation.save();

    // Emit the updated location to connected clients (e.g., driving school owner dashboard)
    io.emit("locationUpdate", { instructorId, latitude, longitude });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

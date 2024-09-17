const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Location = require('./models/Location');  // Location model

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// On client connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for location updates from the instructor
  socket.on('locationUpdate', async (data) => {
    const { instructorId, latitude, longitude } = data;

    // Save the current location to the database
    const newLocation = new Location({
      instructorId,
      latitude,
      longitude,
    });
    await newLocation.save();

    // Emit the location to the owner dashboard
    io.emit('locationUpdate', { instructorId, latitude, longitude });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => console.log('Listening on port 4000'));

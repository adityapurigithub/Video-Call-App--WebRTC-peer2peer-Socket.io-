import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Create a new instance of the Server class, passing in the "server" object and configuration options.
const io = new Server(server, {
  // Configure Cross-Origin Resource Sharing (CORS) settings to allow requests from any origin.
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Set up event handlers for when a client connects to the server.
io.on("connection", (socket) => {
  // Emit a "me" event to the connected client, providing its unique socket ID.
  socket.emit("me", socket.id);

  // Handle the "disconnect" event when a client disconnects.
  socket.on("disconnect", () => {
    // Broadcast a "callEnded" event to all connected clients except the one disconnecting.
    socket.broadcast.emit("callEnded");
  });

  // Handle the "callUser" event when a client wants to initiate a call.
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    // Emit a "callUser" event to the specific user identified by "userToCall."
    // This event contains the signal data and information about the caller.
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  // Handle the "answerCall" event when a client answers an incoming call.
  socket.on("answerCall", (data) => {
    // Emit a "callAccepted" event to the user identified by "data.to."
    // This event includes the signal data for establishing the call.
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(PORT, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log(`server is listening on ${PORT}`);
});

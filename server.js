import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./src/app.js";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export { io };

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

const PORT = process.env.PORT || 5055;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
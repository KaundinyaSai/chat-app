import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const setupSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("sendMessage", (token, message) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const username = decoded.username;

        io.emit("sendMessage", { username, message });
      } catch (error) {
        console.error("Invalid token", error);
      }
    });
  });
};

export default setupSocket;

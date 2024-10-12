import { Server } from "socket.io";

const setupSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("sendMessage", (message) => {
      io.emit("sendMessage", message);
    });
  });
};

export default setupSocket;

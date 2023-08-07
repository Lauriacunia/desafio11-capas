import chatService from "../services/chat.service.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log("👤 New user connected. Soquet ID : ", socket.id);

    socket.on("new-message", async (message) => {
      chatService.create(message);
      const messages = await chatService.getAll();

      socket.emit("refresh-messages", messages);
      socket.broadcast.emit("refresh-messages", messages);
    });

    socket.on("disconnect", () => {
      console.log("User was disconnected");
    });
  });
};

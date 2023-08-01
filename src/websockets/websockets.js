import MongoDBChats from "../daos/mongo/MongoDBChats.js";
const db = new MongoDBChats();

export default (io) => {
  io.on("connection", (socket) => {
    console.log("👤 New user connected. Soquet ID : ", socket.id);

    socket.on("new-message", async (message) => {
      db.create(message);
      const messages = await db.getAll();

      socket.emit("refresh-messages", messages);
      socket.broadcast.emit("refresh-messages", messages);
    });

    socket.on("disconnect", () => {
      console.log("User was disconnected");
    });
  });
};

import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import logger from "./logger.js";

const PORT = process.env.PORT || 5000;

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on("joinTradeChat", ({ tradeId, userId, userName }) => {
    socket.join(tradeId);
    io.to(tradeId).emit("systemMessage", {
      sender: "System",
      message: `${userName} joined the chat`,
      sentTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  });

  socket.on("tradeMessage", ({ tradeId, userName, message }) => {
    io.to(tradeId).emit("chatMessage", {
      sender: userName,
      message,
      sentTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  });

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));

export { app, server, io }; // export for tests


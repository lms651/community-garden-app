import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";
import app from "../app.js";

let io, clientSocket, httpServer;

beforeAll((done) => {
  httpServer = createServer(app);
  io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    // Make the server join the client to the trade room
    socket.on("joinTradeRoom", (tradeId) => {
      socket.join(tradeId);
    });

    socket.on("tradeMessage", ({ tradeId, userName, message }) => {
      io.to(tradeId).emit("chatMessage", {
        sender: userName,
        message,
        sentTime: "test-time",
      });
    });
  });

  httpServer.listen(0, () => {
    const port = httpServer.address().port;
    clientSocket = new Client(`http://localhost:${port}`, { transports: ["websocket"] });

    clientSocket.on("connect", () => {
      console.log("Client connected");
      done();
    });

    clientSocket.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
    });
  });
});

afterAll(() => {
  io.close();
  clientSocket.close();
  httpServer.close();
});

test(
  "client receives chatMessage after sending tradeMessage",
  (done) => {
    const tradeId = "trade123";
    const userName = "Alice";
    const message = "Hello!";

    // Join the room first
    clientSocket.emit("joinTradeRoom", tradeId);

    // Attach listener BEFORE sending message
    clientSocket.on("chatMessage", (data) => {
      expect(data.sender).toBe(userName);
      expect(data.message).toBe(message);
      expect(data.sentTime).toBe("test-time");
      done();
    });

    // Send message to server
    clientSocket.emit("tradeMessage", { tradeId, userName, message });
  },
  15000
);

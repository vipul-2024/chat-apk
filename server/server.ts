import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Socket.io server is healthy!");
});

// MARK: Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A new user connected", socket.id);

  socket.on("message", async (message) => {
    if (message.type === "text" && message.content.startsWith("@ai")) {
      const response = await fetch("https://api.wakati.tech/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: message.content.replaceAll("@ai"),
        }),
      });

      const data = await response.json();

      const newMessage = {
        ...message,
        content: data.res.response,
        name: "AI",
        id: "AI",
      };

      console.log(newMessage);

      io.emit("new_message", newMessage);
    } else {
      socket.broadcast.emit("new_message", message);
    }
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("new_message", data);
  });

  socket.on("user", (data) => {
    socket.broadcast.emit("new_user", data);
  });
});

server.listen(8080, () => {
  console.log("Server listening on PORT: 8080");
});

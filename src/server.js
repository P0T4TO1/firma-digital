module.exports = (httpServer) => {
  const { Server } = require("socket.io");
  const { writeFile } = require("fs");

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`Un usuario se ha conectado con id ${socket.id} !`);

    const cookie = socket.handshake.headers.cookie;
    const username = cookie.split("=").pop();

    // show connected users
    socket.broadcast.emit("connectedUsers", {
      user: username,
    });

    socket.on("message", ({ user, message }) => {
      socket.broadcast.emit("otherMessage", {
        user: user,
        message,
      });
      socket.emit("myMessage", {
        user: user,
        message,
      });
    });

    // private message
    socket.on("privateMessage", ({ user, message, id, room }) => {
      socket.to(id).broadcast.emit("otherPrivateMessage", {
        user: user,
        message,
      });
      socket.to(room).emit("myPrivateMessage", {
        user: user,
        message,
      });
    });

    socket.on("send-files", ({ user, fileContent, filename, fileType }) => {
      socket.emit("receive-my-files", { user, fileContent });
      socket.broadcast.emit("receive-files", {
        user: user,
        fileContent,
        filename,
        fileType,
      });
    });

    socket.on("disconnect", () => {
      // show disconnected users
      io.emit("disconnectedUsers", {
        user: username,
      });
      console.log(`Un usuario se ha desconectado con id ${socket.id} !`);
    });
  });
};

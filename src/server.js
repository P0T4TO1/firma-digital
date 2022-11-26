module.exports = (httpServer) => {
  const { Server } = require("socket.io");

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`Un usuario se ha conectado con id ${socket.id} !`);

    const cookie = socket.handshake.headers.cookie;
    const username = cookie.split("=").pop();

    // show connected users
    io.emit("connectedUsers", {
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

    socket.on("disconnect", () => {
      // show disconnected users
      io.emit("disconnectedUsers", {
        user: username,
      });
      console.log(`Un usuario se ha desconectado con id ${socket.id} !`);
    });
  });
};

const socket = io();

const btnSend = document.getElementById("send-message");
const allMessages = document.getElementById("all-messages");
const messageText = document.getElementById("message");
const usersList = document.getElementById("users-connected");

const username = document.cookie.replace(
  /(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/,
  "$1"
);

btnSend.addEventListener("click", () => {
  if (messageText.value !== "") {
    socket.emit("message", {
      user: username,
      message: messageText.value,
    });
  }
  messageText.value = "";
});

messageText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (messageText.value !== "") {
      socket.emit("message", {
        user: username,
        message: messageText.value,
      });
    }
    messageText.value = "";
  }
});

//show the others messages
socket.on("otherMessage", (data) => {
  const { user, message } = data;
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const time = `${hour}:${minutes}`;
  const msg = document.createRange()
    .createContextualFragment(`<div class="your-message d-flex">
            <div class="image-container me-2">
                <img src="/images/profile.png" alt="">
            </div>
            <div class="message-body">
                <div class="user-info">
                    <span class="username fw-semibold">${user}</span>
                    <span class="time">${time}</span>
                </div>
                <p>${message}</p>
            </div>
        </div>`);

  allMessages.append(msg);
});

socket.on("myMessage", (data) => {
  const { user, message } = data;
  //obtener la hora actual
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const time = `${hour}:${minutes}`;

  const msg = document.createRange()
    .createContextualFragment(`<div class="my-message d-flex justify-content-end">
            <div class="message-body">
                <div class="user-info">
                    <span class="time">${time}</span>
                    <span class="username fw-semibold">${user}</span>
                </div>
                <p style="text-align: end">${message}</p>
            </div>
            <div class="image-container ms-2">
                <img src="/images/profile.png" alt="">
            </div>
        </div>`);

  allMessages.append(msg);
});

socket.on("connectedUsers", (data) => {
  const { user } = data;
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const time = `${hour}:${minutes}`;

  const connections = document.createRange().createContextualFragment(`
        <li class="p-2 border-bottom">
          <a href="#!" class="d-flex justify-content-between">
            <div class="d-flex flex-row">
              <div class="pt-1">
                <p class="fw-bold mb-0">${user}</p>
                <p class="small text-muted">Se ha conectado</p>
              </div>
            </div>
            <div class="pt-1">
              <p class="small text-muted mb-1">${time}</p>
            </div>
          </a>
        </li>
    `);
  usersList.append(connections);
});

socket.on("disconnectedUsers", (data) => {
  const { user } = data;
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const time = `${hour}:${minutes}`;

  const connections = document.createRange().createContextualFragment(`
        <li class="p-2 border-bottom">
          <a href="#!" class="d-flex justify-content-between">
            <div class="d-flex flex-row">
              <div class="pt-1">
                <p class="fw-bold mb-0">${user}</p>
                <p class="small text-muted">Se ha desconectado</p>
              </div>
            </div>
            <div class="pt-1">
              <p class="small text-muted mb-1">${time}</p>
            </div>
          </a>
        </li>
    `);
  usersList.append(connections);
});

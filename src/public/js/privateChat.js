const socket = io();

const params = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(params);

const btnSend = document.getElementById("send-private-message");
const allMessages = document.getElementById("all-private-messages");
const messageText = document.getElementById("message");
const usersList = document.getElementById("users-connected");
const otherUser = document.getElementById("username-chat");

otherUser.innerHTML = params.chat;

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

socket.on("otherMessage", (data) => {
  const { user, message } = data;
  const date = new Date();
  const hour = date.getHours().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const minutes = date.getMinutes().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const time = `${hour}:${minutes}`;
  const msg = document.createRange()
    .createContextualFragment(`<div class="your-message d-flex">
            <div class="image-container me-2">
                <img src="/images/fotoPerfil.jpg" alt="">
            </div>
            <div class="message-body">
                <div class="user-info">
                    <span class="username fw-semibold text-light">${user}</span>
                    <span class="time text-light">${time}</span>
                </div>
                <p class="text-light">${message}</p>
            </div>
        </div>`);

  allMessages.append(msg);
});

socket.on("myMessage", (data) => {
  const { user, message } = data;
  //obtener la hora actual
  const date = new Date();
  const hour = date.getHours().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const minutes = date.getMinutes().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const time = `${hour}:${minutes}`;

  const msg = document.createRange()
    .createContextualFragment(`<div class="my-message d-flex justify-content-end">
            <div class="message-body">
                <div class="user-info">
                    <span class="time text-light">${time}</span>
                    <span class="username fw-semibold text-light">${user}</span>
                </div>
                <p class="text-light text-end">${message}</p>
            </div>
            <div class="image-container ms-2">
                <img src="/images/fotoPerfil.jpg" alt="">
            </div>
        </div>`);

  allMessages.append(msg);
});

socket.on("connectedUsers", (data) => {
  const { user } = data;
  const date = new Date();
  const hour = date.getHours().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const minutes = date.getMinutes().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const time = `${hour}:${minutes}`;

  const connections = document.createRange().createContextualFragment(`
        <li class="p-2 border-bottom">
          <a href="/t?chat=${user}" class="d-flex justify-content-between">
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

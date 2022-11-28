const socket = io();

const btnSend = document.getElementById("send-message");
const allMessages = document.getElementById("all-messages");
const messageText = document.getElementById("message");
const usersList = document.getElementById("users-connected");
const btnGoSignature = document.getElementById("btnSignatureView");
const btnGoVerify = document.getElementById("btnVerifyView");
const fileMultiple = document.getElementById("file-multiple");

const username = document.cookie.replace(
  /(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/,
  "$1"
);

fileMultiple.addEventListener("change", (e) => {
  // attach files to show in the chat
  const files = e.target.files[0];
  // read files and send content to the server
  const reader = new FileReader();
  reader.onload = (e) => {
    const fileContent = e.target.result;
    socket.emit("send-files", { user: username, fileContent });
  };
  reader.readAsText(files);
});

btnGoVerify.addEventListener("click", () => {
  window.location.href = "/verifySignature";
});

btnGoSignature.addEventListener("click", () => {
  document.location.href = "/signature";
});

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

socket.on("receive-my-files", (data) => {
  const { user, fileContent } = data;
  console.log(fileContent);
  const date = new Date();
  const hour = date.getHours().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const minutes = date.getMinutes().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const time = `${hour}:${minutes}`;
  const li = document.createRange().createContextualFragment(`
    <div class="my-message d-flex justify-content-end">
            <div class="message-body">
                <div class="user-info">
                    <span class="time text-light">${time}</span>
                    <span class="username fw-semibold text-light">${user}</span>
                </div>
                <p class="text-light text-end"">${fileContent}</p>
            </div>
            <div class="image-container ms-2">
                <img src="/images/fotoPerfil.jpg" alt="">
            </div>
        </div>
    `);
  allMessages.appendChild(li);
});

socket.on("receive-files", (data) => {
  const { user, fileContent } = data;
  const date = new Date();
  const hour = date.getHours().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const minutes = date.getMinutes().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const time = `${hour}:${minutes}`;
  console.log(fileContent);

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
                <p class="text-light" style="max-width: 200px !important;">${fileContent}</p>
            </div>
        </div>`);

  allMessages.append(msg);
});

//show the others messages
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
            <div class="message-body overflow-hidden">
                <div class="user-info">
                    <span class="username fw-semibold text-light">${user}</span>
                    <span class="time text-light">${time}</span>
                </div>
                <p class="text-light"">${message}</p>
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

socket.on("disconnectedUsers", (data) => {
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
});

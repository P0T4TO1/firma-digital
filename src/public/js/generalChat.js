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

let formData = new FormData();

fileMultiple.addEventListener("change", (e) => {
  const files = e.target.files[0];
  const file = new File([files], files.name, { type: files.type });
  formData.append("file", file);
  formData.append("fileNames", files.name);
  formData.append("fileTypes", files.type);
  formData.set("fileNames", files.name);
  formData.set("fileTypes", files.type);
  formData.set("file", file);
  socket.emit("send-files", {
    user: username,
    fileContent: file,
    filename: formData.get("fileNames").toString(),
    fileType: formData.get("fileTypes").toString(),
  });
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

const convertBase64ToFile = (base64) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], formData.get("fileNames").toString(), {
    type: formData.get("fileTypes").toString(),
  });
};

function downloadFile(file) {
  const url = window.URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

socket.on("receive-my-files", async (data) => {
  const { user, fileContent } = data;

  const base64 = arrayBufferToBase64(fileContent);

  const file = convertBase64ToFile(base64);

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
                <p class="text-light text-end"">${file.name}</p>
                <button class="btn btn-primary btn-sm" id="${file.name}"
                >Download</button>
            </div>
            <div class="image-container ms-2">
                <img src="/images/fotoPerfil.jpg" alt="">
            </div>
        </div>
    `);
  allMessages.appendChild(li);
  const btnDownload = document.getElementById(`${file.name}`);
  btnDownload.addEventListener("click", () => {
    downloadFile(file);
  });
});

socket.on("receive-files", (data) => {
  const convertBase64ToFile = (base64) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], data.filename, {
      type: data.fileType,
    });
  };
  const { user, fileContent } = data;
  const date = new Date();
  const hour = date.getHours().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const minutes = date.getMinutes().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const time = `${hour}:${minutes}`;
  const base64 = arrayBufferToBase64(fileContent);

  const file = convertBase64ToFile(base64);

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
                <p class="text-light text-end"">${file.name}</p>
                <button class="btn btn-primary btn-sm" id="${file.name}"
                >Download</button>
            </div>
        </div>`);
  allMessages.append(msg);
  const btnDownload = document.getElementById(`${file.name}`);
  btnDownload.addEventListener("click", () => {
    downloadFile(file);
  });
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

  const disconnections = document.createRange().createContextualFragment(`
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

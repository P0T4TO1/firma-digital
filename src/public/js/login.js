const username = document.getElementById("username");
const room = document.getElementById("room");
const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", () => {
  if (username.value !== "" && room.value !== "") {
    document.cookie = `username=${username.value}`;
    document.cookie = `room=${room.value}`;
    document.location.href = "/";
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor, llena todos los campos",
    });
  }
});

// same action as the login button but with the enter key
username.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (username.value !== "" && room.value !== "") {
      document.cookie = `username=${username.value}`;
      document.cookie = `room=${room.value}`;
      document.location.href = "/";
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, llena todos los campos",
      });
    }
  }
});

// same action as the login button but with the enter key
room.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (username.value !== "" && room.value !== "") {
      document.cookie = `username=${username.value}`;
      document.cookie = `room=${room.value}`;
      document.location.href = "/";
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, llena todos los campos",
      });
    }
  }
});

const btnKeys = document.getElementById("btnGenerateKeys");
const publicKeyInput = document.getElementById("publicKey");
const privateKeyInput = document.getElementById("privateKey");
const divKeys = document.getElementById("divKeys");
const inputFile = document.getElementById("inputFile");
const btnSign = document.getElementById("btnSign");
let formDataVerify = new FormData();

btnKeys.addEventListener("click", async () => {
  await axios
    .get("/generate-key-pair", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      const { publicKey, privateKey } = response.data;
      publicKeyInput.value = publicKey;
      privateKeyInput.value = privateKey;
      divKeys.classList.remove("d-none");
    });
});

inputFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const fileContent = e.target.result;
    formDataVerify.append("dataFile", fileContent);
  };
  reader.readAsText(file);
});

btnSign.addEventListener("click", async () => {
  if (!publicKeyInput.value || !formDataVerify.get("dataFile")) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor, llena todos los campos",
    });
    return;
  }
  const privateKey = privateKeyInput.value;
  formDataVerify.append("privateKey", privateKey);

  await fetch("/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dataFile: formDataVerify.get("dataFile"),
      privateKey: formDataVerify.get("privateKey"),
    }),
  })
    .then((response) => response.json())
    .then((value) => {
      let { signature } = value;
      // put signature in a file and download
      const element = document.createElement("a");
      const file = new Blob([signature], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "signature.txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    });
});

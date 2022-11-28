let publicKey = document.getElementById("publicKeyInput");
let signature = document.getElementById("signatureInput");
let fileToVerify = document.getElementById("inputFile");
const btnVerify = document.getElementById("btnVerify");

let formData = new FormData();

publicKey.addEventListener("change", (e) => {
  let publicKey = e.target.value;
  formData.append("publicKey", publicKey);
  formData.set("publicKey", publicKey);
  console.log(formData.get("publicKey"));
});

signature.addEventListener("change", (e) => {
  let signature = e.target.value;
  formData.append("signature", signature);
  formData.set("signature", signature);
  console.log(formData.get("signature"));
});

fileToVerify.addEventListener("change", (e) => {
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = (e) => {
    let fileContent = e.target.result;
    formData.append("dataFile", fileContent);
    formData.set("dataFile", fileContent);
    console.log(formData.get("dataFile"));
  };
  reader.readAsText(file);
});

btnVerify.addEventListener("click", async () => {
  if (
    !formData.get("publicKey") ||
    !formData.get("signature") ||
    !formData.get("dataFile")
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor, llena todos los campos",
    });
    return;
  }

  console.log(
    "llave public: " + formData.get("publicKey"),
    " firma: " + formData.get("signature"),
    " archivo: " + formData.get("dataFile")
  );
  await fetch("/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicKey: formData.get("publicKey"),
      signature: formData.get("signature"),
      dataFile: formData.get("dataFile"),
    }),
  })
    .then((response) => response.json())
    .then((value) => {
      let { result } = value;
      if (result === true) {
        Swal.fire({
          icon: "success",
          title: "Documento autenticado, firma válida",
          text: result,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `El documento no es válido, la firma no coincide con el documento`,
        });
      }
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salió mal",
      });
    });
});

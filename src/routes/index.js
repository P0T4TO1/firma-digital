const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const views = path.join(__dirname, "../views");

const isLoginIn = require("../middlewares/isLoginIn");
const isInLoginPath = require("../middlewares/isInLoginPath");

router.get("/", isLoginIn, (req, res) => {
  res.sendFile(views + "/index.html");
});

router.get("/login", isInLoginPath, (req, res) => {
  res.sendFile(views + "/login.html");
});

router.get("/t", isLoginIn, async (req, res) => {
  res.sendFile(views + "/privateChat.html");
});

router.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/login");
});

router.get("/generate-key-pair", (req, res) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "der",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "der",
    },
  });
  res.send({
    publicKey: publicKey.toString("base64"),
    privateKey: privateKey.toString("base64"),
  });
});

router.post("/sign", (req, res) => {
  let { dataFile, privateKey } = req.body;

  privateKey = crypto.createPrivateKey({
    key: Buffer.from(privateKey, "base64"),
    type: "pkcs8",
    format: "der",
  });
  const sign = crypto.createSign("SHA256");
  sign.update(dataFile);
  sign.end();

  const signature = sign.sign(privateKey, "base64");
  res.send({ dataFile, signature });
});

router.post("/verify", (req, res) => {
  let { dataFile, signature, publicKey } = req.body;

  publicKey = crypto.createPublicKey({
    key: Buffer.from(publicKey, "base64"),
    type: "spki",
    format: "der",
  });
  const verify = crypto.createVerify("SHA256");
  verify.update(dataFile);
  verify.end();

  const result = verify.verify(publicKey, signature, "base64");
  res.send({ result }).status(200);
});

router.get("/signature", isLoginIn, (req, res) => {
  res.sendFile(views + "/signature.html");
});

router.get("/verifySignature", isLoginIn, (req, res) => {
  res.sendFile(views + "/verify.html");
});

module.exports = router;

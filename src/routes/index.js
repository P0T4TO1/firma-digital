const express = require("express");
const router = express.Router();
const path = require("path");

const views = path.join(__dirname, "../views");

const isLoginIn = require("../middlewares/isLoginIn");
const isInLoginPath = require("../middlewares/isInLoginPath");

router.get("/", isLoginIn, (req, res) => {
  res.sendFile(views + "/index.html");
});

router.get("/login", isInLoginPath, (req, res) => {
  res.sendFile(views + "/login.html");
});

router.get("/example", (req, res) => {
    res.sendFile(views + "/example.html");
});

router.get("/logout", (req, res) => {
    res.clearCookie("username");
    res.redirect("/login");
});

module.exports = router;
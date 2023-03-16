const { response } = require("express");
var express = require("express");
const { io } = require("socket.io");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Block Pics" });
});

router.get("/trail", function (req, res, next) {
  res.send("saas");
});

module.exports = router;

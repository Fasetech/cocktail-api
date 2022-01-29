const express = require("express");
const router = express.Router();

var cocktail_controller = require("../controllers/cocktailController");

router.put("/", cocktail_controller.create);

module.exports = router;
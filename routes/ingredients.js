const express = require("express");
const router = express.Router();

var ingredient_controller = require("../controllers/ingredientController");

router.put("/", ingredient_controller.create);

router.get("/", ingredient_controller.get_all);

router.get("/:id", ingredient_controller.get_by_id_or_name);

router.delete("/:id", ingredient_controller.delete);

module.exports = router;
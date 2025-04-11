const express = require("express");
const router = express.Router();

const bookController = require("../controller/bookController");

// CRUD routes
router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);
router.post("/", bookController.create);
router.put("/:id", bookController.update);
router.delete("/:id", bookController.remove);
router.put("/:id/decrease", bookController.decreaseStock);


module.exports = router;

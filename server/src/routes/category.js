const express = require("express");
const router = express.Router();

const categoryController = require("../controller/categoryController");

// GET: Lấy tất cả danh mục
router.get("/", categoryController.getAll);

// GET: Tìm danh mục theo ID
router.get("/:id", categoryController.getById);

// POST: Tạo danh mục mới
router.post("/", categoryController.create);

// PUT: Cập nhật danh mục
router.put("/:id", categoryController.update);

// DELETE: Xoá danh mục
router.delete("/:id", categoryController.remove);

module.exports = router;

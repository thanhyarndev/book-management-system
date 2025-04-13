const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// GET: Lấy tất cả danh mục - nhân viên và admin đều được
router.get("/", authenticateToken, authorizeRoles("admin", "employee"), categoryController.getAll);

// GET: Lấy danh mục theo ID - nhân viên và admin đều được
router.get("/:id", authenticateToken, authorizeRoles("admin", "employee"), categoryController.getById);

// POST: Tạo danh mục mới - chỉ admin
router.post("/", authenticateToken, authorizeRoles("admin"), categoryController.create);

// PUT: Cập nhật danh mục - chỉ admin
router.put("/:id", authenticateToken, authorizeRoles("admin"), categoryController.update);

// DELETE: Xoá danh mục - chỉ admin
router.delete("/:id", authenticateToken, authorizeRoles("admin"), categoryController.remove);

module.exports = router;

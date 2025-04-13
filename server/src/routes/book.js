const express = require("express");
const router = express.Router();

const bookController = require("../controller/bookController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Lấy tất cả sách - nhân viên và admin
router.get("/", authenticateToken, authorizeRoles("admin", "employee"), bookController.getAll);

// Lấy sách theo ID - nhân viên và admin
router.get("/:id", authenticateToken, authorizeRoles("admin", "employee"), bookController.getById);

// Thêm sách mới - chỉ admin
router.post("/", authenticateToken, authorizeRoles("admin"), bookController.create);

// Cập nhật sách - chỉ admin
router.put("/:id", authenticateToken, authorizeRoles("admin"), bookController.update);

// Xóa sách - chỉ admin
router.delete("/:id", authenticateToken, authorizeRoles("admin"), bookController.remove);

// Giảm tồn kho (sau khi tạo đơn hàng) - admin và nhân viên
router.put("/:id/decrease", authenticateToken, authorizeRoles("admin", "employee"), bookController.decreaseStock);

module.exports = router;

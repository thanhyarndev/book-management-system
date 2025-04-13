const express = require("express");
const router = express.Router();
const promotionController = require("../controller/promotionController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Nhân viên & admin có thể xem danh sách, xem theo ID và tìm theo code
router.get("/", authenticateToken, authorizeRoles("admin", "employee"), promotionController.getAll);
router.get("/:id", authenticateToken, authorizeRoles("admin", "employee"), promotionController.getById);
router.get("/find/by-code", authenticateToken, authorizeRoles("admin", "employee"), promotionController.getByCode);

// Chỉ admin mới có thể thêm/sửa/xoá
router.post("/", authenticateToken, authorizeRoles("admin"), promotionController.create);
router.put("/:id", authenticateToken, authorizeRoles("admin"), promotionController.update);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), promotionController.remove);

module.exports = router;

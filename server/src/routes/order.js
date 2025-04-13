const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Tạo đơn hàng: bất kỳ ai đã đăng nhập (nhân viên, admin)
router.post("/", authenticateToken, orderController.createOrder);

// Nhân viên và admin đều có thể xem tất cả đơn hàng
router.get("/", authenticateToken, authorizeRoles("admin", "employee"), orderController.getAllOrders);

// Xem đơn hàng theo ID: chỉ cần đăng nhập
router.get("/:id", authenticateToken, orderController.getOrderById);

// Xoá đơn hàng: chỉ admin mới được phép
router.delete("/:id", authenticateToken, authorizeRoles("admin"), orderController.deleteOrder);

module.exports = router;

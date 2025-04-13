const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Chỉ admin xem toàn bộ danh sách khách hàng
router.get("/", authenticateToken, authorizeRoles("admin"), customerController.getAllCustomers);

// Xem khách hàng theo ID - admin
router.get("/:id", authenticateToken, authorizeRoles("admin"), customerController.getCustomerById);

// Tìm khách theo SĐT - admin và nhân viên
router.get("/phone/:phone", authenticateToken, authorizeRoles("admin", "employee"), customerController.getCustomerByPhone);

// Tạo mới khách hàng (ví dụ tạo khi POS) - admin và nhân viên
router.post("/", authenticateToken, authorizeRoles("admin", "employee"), customerController.createCustomer);

// Cập nhật khách hàng - chỉ admin
router.put("/:id", authenticateToken, authorizeRoles("admin"), customerController.updateCustomer);

// Xóa khách hàng - chỉ admin
router.delete("/:id", authenticateToken, authorizeRoles("admin"), customerController.deleteCustomer);

module.exports = router;

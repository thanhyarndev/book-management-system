const express = require("express");
const router = express.Router();
const dashboard = require("../controller/dashboard");

// Middleware xác thực & phân quyền
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Lấy dữ liệu tổng quan cho dashboard
router.get(
  "/get-datas",
  authenticateToken,
  authorizeRoles("admin", "employee"),
  dashboard.getDatas
);

module.exports = router;

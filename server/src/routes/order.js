const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

// API tạo đơn hàng
router.post("/", orderController.createOrder);

// Lấy tất cả đơn hàng
router.get("/", orderController.getAllOrders);

// Lấy đơn hàng theo ID
router.get("/:id", orderController.getOrderById);

// Xoá đơn hàng (nếu cần)
router.delete("/:id", orderController.deleteOrder);

module.exports = router;

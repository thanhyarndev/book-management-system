const Order = require("../models/Order");
const Customer = require("../models/Customer");

class OrderController {
  // Lấy tất cả đơn hàng
  async getAllOrders(req, res) {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("customer");
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi lấy đơn hàng", err });
    }
  }

  // Lấy đơn hàng theo ID
  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id).populate("customer");
      if (!order)
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi lấy đơn hàng", err });
    }
  }

  // Tạo đơn hàng mới
  async createOrder(req, res) {
    const { customerName, customerPhone, items, totalAmount, note } = req.body;

    if (!customerName || !customerPhone || !items?.length) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }

    try {
      // Tìm theo phonenumber vì model dùng phonenumber
      let customer = await Customer.findOne({ phonenumber: customerPhone });

      // Nếu không có khách hàng → tạo mới
      if (!customer) {
        customer = new Customer({
          name: customerName,
          phonenumber: customerPhone,
          totalSpent: totalAmount,
          visitCount: 1,
        });
        await customer.save();
      } else {
        // Nếu có → cập nhật thông tin
        customer.name = customerName; // cập nhật lại tên (đề phòng sửa tên)
        customer.totalSpent = (customer.totalSpent || 0) + totalAmount;
        customer.visitCount = (customer.visitCount || 0) + 1;
        await customer.save();
      }

      // Tạo đơn hàng
      const newOrder = new Order({
        customer: customer._id,
        customerName,
        customerPhone,
        items,
        totalAmount,
        note,
        status: "paid",
      });

      await newOrder.save();

      res
        .status(201)
        .json({ message: "Tạo đơn hàng thành công", order: newOrder });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi tạo đơn hàng", err });
    }
  }

  
  // Xoá đơn hàng
  async deleteOrder(req, res) {
    try {
      const deleted = await Order.findByIdAndDelete(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "Không tìm thấy để xoá" });
      res.status(200).json({ message: "Đã xoá đơn hàng" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi xoá đơn hàng", err });
    }
  }
}

module.exports = new OrderController();

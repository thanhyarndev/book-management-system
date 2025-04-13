const Book = require("../models/Book");
const Order = require("../models/Order");
const Customer = require("../models/Customer");

class dashboard {
  // Lấy tất cả dữ liệu
  async getDatas(req, res) {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Tổng doanh thu
      const orders = await Order.find();
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const totalOrders = orders.length;

      // Tổng số sách và hàng tồn kho
      const books = await Book.find();
      const totalBooks = books.length;
      const totalStock = books.reduce((sum, b) => sum + b.quantity, 0);

      // Khách hàng
      const totalCustomers = await Customer.countDocuments();
      const newCustomersThisMonth = await Customer.countDocuments({
        createdAt: { $gte: startOfMonth },
      });

      // Sách bán chạy
      const topSellingBooks = await Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            title: { $first: "$items.title" },
            sku: { $first: "$items.sku" },
            totalSold: { $sum: "$items.quantity" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]);

      return res.status(200).json({
        totalRevenue,
        totalOrders,
        totalBooks,
        totalStock,
        totalCustomers,
        newCustomersThisMonth,
        topSellingBooks,
      });
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu dashboard:", err);
      return res.status(500).json({
        message: "Lỗi khi tổng hợp dữ liệu dashboard",
        error: err.message,
      });
    }
  }
}

module.exports = new dashboard();

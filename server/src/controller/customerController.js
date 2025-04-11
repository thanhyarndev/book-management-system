const Customer = require("../models/Customer");

class CustomerController {
  async getAllCustomers(req, res) {
    try {
      const customers = await Customer.find().sort({ createdAt: -1 });
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy danh sách khách hàng", error });
    }
  }

  async getCustomerById(req, res) {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer)
        return res.status(404).json({ message: "Không tìm thấy khách hàng" });
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy khách hàng", error });
    }
  }

  async getCustomerByPhone(req, res) {
    try {
      const customer = await Customer.findOne({
        phonenumber: req.params.phone,
      });
      if (!customer)
        return res
          .status(404)
          .json({ message: "Không tìm thấy khách hàng theo SĐT" });
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ message: "Lỗi truy vấn theo SĐT", error });
    }
  }

  async createCustomer(req, res) {
    const { name, phonenumber } = req.body;
    if (!name || !phonenumber) {
      return res.status(400).json({ message: "Vui lòng nhập tên và SĐT" });
    }

    try {
      const existing = await Customer.findOne({ phonenumber });
      if (existing)
        return res.status(400).json({ message: "Khách hàng đã tồn tại" });

      const newCustomer = new Customer({ name, phonenumber });
      await newCustomer.save();
      res.status(201).json(newCustomer);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo khách hàng", error });
    }
  }

  async updateCustomer(req, res) {
    const { name, phonenumber, point, totalSpent, loyaltyLevel, visitCount } =
      req.body;

    try {
      const updated = await Customer.findByIdAndUpdate(
        req.params.id,
        {
          name,
          phonenumber,
          point,
          totalSpent,
          loyaltyLevel,
          visitCount,
          updatedAt: Date.now(),
        },
        { new: true, runValidators: true }
      );
      if (!updated)
        return res.status(404).json({ message: "Không tìm thấy để cập nhật" });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật khách hàng", error });
    }
  }

  async deleteCustomer(req, res) {
    try {
      const deleted = await Customer.findByIdAndDelete(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "Không tìm thấy để xoá" });
      res.status(200).json({ message: "Đã xoá khách hàng" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi xoá khách hàng", error });
    }
  }
}

module.exports = new CustomerController();

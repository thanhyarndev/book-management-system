const User = require("../models/User");

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-password -otp -otpExpiry");
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", err });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).select("-password -otp -otpExpiry");
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi lấy người dùng", err });
    }
  }

  async createUser(req, res) {
    const { email, password, firstName, lastName, role, accountStatus } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
      }

      const newUser = new User({
        email,
        password, // cần mã hoá khi tích hợp sau
        firstName,
        lastName,
        role: role || "employee",
        accountStatus: accountStatus || "active",
      });

      await newUser.save();
      res.status(201).json({ message: "Tạo người dùng thành công", user: newUser });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi tạo người dùng", err });
    }
  }

  async updateUser(req, res) {
    const { email, firstName, lastName, role, accountStatus } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { email, firstName, lastName, role, accountStatus, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật" });
      }

      res.status(200).json({ message: "Cập nhật thành công", user: updatedUser });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi cập nhật người dùng", err });
    }
  }

  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng để xoá" });
      }

      res.status(200).json({ message: "Đã xoá người dùng" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi xoá người dùng", err });
    }
  }
}

module.exports = new UserController();

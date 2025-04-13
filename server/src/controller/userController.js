const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "quangkiet"; // key mã hoá


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

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        SECRET_KEY,
        { expiresIn: "10m" } // 10 phút
      );

      res.status(200).json({ message: "Đăng nhập thành công", token });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi đăng nhập", err });
    }
  }
  async verifyToken(req, res){
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const decoded = jwt.verify(token, "quangkiet");
      return res.status(200).json({ valid: true, user: decoded });
    } catch (err) {
      return res.status(401).json({ valid: false, message: "Token hết hạn hoặc không hợp lệ" });
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
  
      // Băm mật khẩu trước khi lưu
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || "employee",
        accountStatus: accountStatus || "active",
      });
  
      await newUser.save();
  
      // Không trả password ra ngoài
      const userResponse = newUser.toObject();
      delete userResponse.password;
  
      res.status(201).json({ message: "Tạo người dùng thành công", user: userResponse });
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

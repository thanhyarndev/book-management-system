const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../config/emailConfig");

class UserController {
  // Lấy tất cả người dùng
  async getUsers(req, res) {
    try {
      const users = await UserModel.find()
        .populate('employeeId')
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving users", error });
    }
  }

  // Tạo mới người dùng
  async createNewUser(req, res) {
    const { email, password, firstName, lastName, role, accountStatus, emplyeeSelected } =
      req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || "employee",
        accountStatus: accountStatus || "active",
        employeeId: emplyeeSelected || null,
      });

      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: "Error creating user", error });
    }
  }

  // Cập nhật người dùng
  async updateUser(req, res) {
    const { id } = req.params;
    const { email, firstName, lastName } = req.body;

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { email, firstName, lastName,},
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  }

  // Xóa người dùng
  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const userAdmin = await UserModel.findById(id);

      if (userAdmin && userAdmin.email === "admin@gmail.com")
        return res.status(403).json({ message: "Can not deleting admin user" });

      const deletedUser = await UserModel.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(204).send(); // No Content
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  }

  // Lấy thông tin người dùng theo ID
  async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user", error });
    }
  }

  // Thay đổi trạng thái của người dùng
  async changeUserStatus(req, res) {
    const { id } = req.params;
    const { accountStatus } = req.body;

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { accountStatus },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error changing user status", error });
    }
  }

  // Đăng ký người dùng
  async register(req, res) {
    const { email, password, firstName, lastName, role, accountStatus } =
      req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || "client",
        accountStatus: accountStatus || "active",
      });

      await newUser.save();
      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create and sign JWT
      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
          status: user.accountStatus,
        },
        "duyanh",
        { expiresIn: "1d" }
      );
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  }

  async verifyEmailAndGenerateOTP(req, res) {
    const { email } = req.body;

    try {
      // Kiểm tra xem email có tồn tại trong hệ thống không
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }

      // Tạo mã OTP ngẫu nhiên gồm 6 chữ số
      const otp = crypto.randomInt(100000, 999999).toString();

      // Tính thời gian hết hạn OTP (hiện tại + 3 phút)
      const otpExpiry = new Date(Date.now() + 3 * 60 * 1000);

      // Cập nhật OTP và OTP expiry vào database
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      // Gửi OTP qua email
      const emailSubject = "Your OTP Code";
      const emailBody = `
      <p>Hello,</p>
      <p>Your OTP code is <strong>${otp}</strong>. This code is valid for 3 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thanks,</p>
      <p>Your Company Team</p>
    `;

      await sendEmail({
        to: email,
        subject: emailSubject,
        html: emailBody,
      });

      // Trả về phản hồi thành công mà không gửi OTP về client
      res.status(200).json({
        message: "OTP has been sent to your email",
      });
    } catch (error) {
      console.error("Error verifying email and generating OTP:", error);
      res.status(500).json({ message: "Error generating OTP", error });
    }
  }

  async verifyOTP(req, res) {
    const { email, otp } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }

      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (new Date() > new Date(user.otpExpiry)) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      // Tạo token chứa email và thời hạn OTP
      const resetToken = jwt.sign(
        { email, otpExpiry: user.otpExpiry },
        "duyanh",
        { expiresIn: "15m" } // Token có hiệu lực 15 phút
      );

      res.status(200).json({
        message: "OTP verified successfully",
        token: resetToken, // Trả về token
      });

      // Xóa OTP khỏi database để đảm bảo OTP không thể sử dụng lại
      user.otp = null;
      await user.save();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Error verifying OTP", error });
    }
  }

  async resetPassword(req, res) {
    const { token, password } = req.body;

    try {
      // Giải mã token
      const decoded = jwt.verify(token, "duyanh");

      // Kiểm tra thời hạn OTP
      if (new Date() > new Date(decoded.otpExpiry)) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      // Tìm user bằng email từ token
      const user = await UserModel.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cập nhật mật khẩu mới
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);

      if (error.name === "TokenExpiredError") {
        return res.status(400).json({ message: "Reset token has expired" });
      }

      res.status(500).json({ message: "Error resetting password", error });
    }
  }
}

module.exports = new UserController();

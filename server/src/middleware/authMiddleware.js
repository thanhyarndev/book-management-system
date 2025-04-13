const jwt = require("jsonwebtoken");

const SECRET_KEY = "quangkiet"; // key dùng để verify token

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy token" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    req.user = user; // lưu thông tin user giải mã được vào request
    next();
  });
};

// Middleware kiểm tra quyền
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};

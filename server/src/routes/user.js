const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Login không cần token
router.post("/login", userController.login);
router.get("/verify-token", userController.verifyToken);

// Bảo vệ các API còn lại
router.get("/", authenticateToken, authorizeRoles("admin"), userController.getAllUsers);
router.get("/:id", authenticateToken, userController.getUserById);
router.post("/", authenticateToken, authorizeRoles("admin"), userController.createUser);
router.put("/:id", authenticateToken, authorizeRoles("admin"), userController.updateUser);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), userController.deleteUser);

module.exports = router;

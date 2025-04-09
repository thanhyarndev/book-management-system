const Promotion = require("../models/Promotion");

class PromotionController {
  async getAll(req, res) {
    try {
      const promotions = await Promotion.find();
      res.status(200).json(promotions);
    } catch (err) {
      res.status(500).json({ message: "Lỗi lấy danh sách khuyến mãi", err });
    }
  }

  async getById(req, res) {
    try {
      const promotion = await Promotion.findById(req.params.id);
      if (!promotion) return res.status(404).json({ message: "Không tìm thấy" });
      res.status(200).json(promotion);
    } catch (err) {
      res.status(500).json({ message: "Lỗi lấy khuyến mãi", err });
    }
  }

  async create(req, res) {
    const { code, description, type, value, expiryDate, minOrderValue, quantity, status } = req.body;

    if (!code || !type || !value || !expiryDate || quantity == null) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    try {
      const existing = await Promotion.findOne({ code });
      if (existing) {
        return res.status(400).json({ message: "Mã khuyến mãi đã tồn tại" });
      }

      const newPromotion = new Promotion({
        code,
        description,
        type,
        value,
        expiryDate,
        minOrderValue,
        quantity,
        status: status || "active",
      });
      await newPromotion.save();
      res.status(201).json(newPromotion);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi tạo khuyến mãi", err });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { code, description, type, value, expiryDate, minOrderValue, quantity, status } = req.body;

    try {
      const updated = await Promotion.findByIdAndUpdate(
        id,
        { code, description, type, value, expiryDate, minOrderValue, quantity, status },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ message: "Không tìm thấy để cập nhật" });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ message: "Lỗi cập nhật", err });
    }
  }

  async remove(req, res) {
    try {
      const deleted = await Promotion.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Không tìm thấy để xoá" });
      res.status(200).json({ message: "Đã xoá khuyến mãi" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi xoá khuyến mãi", err });
    }
  }
}

module.exports = new PromotionController();

const CategoryModel = require("../models/Category");

class CategoryController {
  // Lấy tất cả danh mục
  async getAll(req, res) {
    try {
      const categories = await CategoryModel.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh mục", error });
    }
  }

  // Lấy danh mục theo ID
  async getById(req, res) {
    const { id } = req.params;
    try {
      const category = await CategoryModel.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tìm danh mục", error });
    }
  }

  // Tạo danh mục mới
  async create(req, res) {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
    }

    try {
      const existing = await CategoryModel.findOne({ name });
      if (existing) {
        return res.status(400).json({ message: "Danh mục đã tồn tại" });
      }

      const newCategory = new CategoryModel({
        name,
        description,
      });

      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo danh mục", error });
    }
  }

  // Cập nhật danh mục
  async update(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        id,
        { name, description },
        { new: true, runValidators: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }

      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật danh mục", error });
    }
  }

  // Xóa danh mục
  async remove(req, res) {
    const { id } = req.params;

    try {
      const deletedCategory = await CategoryModel.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy danh mục để xoá" });
      }

      res.status(200).json({ message: "Đã xoá danh mục" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xoá danh mục", error });
    }
  }
}

module.exports = new CategoryController();

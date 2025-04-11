// controller/bookController.js
const Book = require("../models/Book");

class BookController {
  async getAll(req, res) {
    try {
      const books = await Book.find().populate("category");
      res.status(200).json(books);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách sách", err });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    try {
      const book = await Book.findById(id).populate("category");
      if (!book) {
        return res.status(404).json({ message: "Không tìm thấy sách" });
      }
      res.status(200).json(book);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi tìm sách", err });
    }
  }

  async create(req, res) {
    const {
      sku,
      title,
      author,
      price,
      description,
      quantity,
      category,
      image,
    } = req.body;
    if (!sku || !title || !price || quantity == null) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    try {
      const existing = await Book.findOne({ sku });
      if (existing) {
        return res.status(400).json({ message: "SKU đã tồn tại" });
      }

      const newBook = new Book({
        sku,
        title,
        author,
        price,
        description,
        quantity,
        category,
        image,
      });

      await newBook.save();
      res.status(201).json(newBook);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi tạo sách", err });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const {
      sku,
      title,
      author,
      price,
      description,
      quantity,
      category,
      image,
    } = req.body;

    try {
      const updated = await Book.findByIdAndUpdate(
        id,
        { sku, title, author, price, description, quantity, category, image },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sách để cập nhật" });
      }

      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi cập nhật sách", err });
    }
  }

  async remove(req, res) {
    const { id } = req.params;
    try {
      const deleted = await Book.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy sách để xoá" });
      }
      res.status(200).json({ message: "Đã xoá sách" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi xoá sách", err });
    }
  }
  // Giảm số lượng tồn kho
  async decreaseStock(req, res) {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
      const product = await Book.findById(id);
      if (!product)
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

      if (product.quantity < quantity) {
        return res.status(400).json({ message: "Không đủ tồn kho để trừ" });
      }

      product.quantity -= quantity;
      await product.save();

      res.status(200).json({ message: "Cập nhật tồn kho thành công", product });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi cập nhật tồn kho", err });
    }
  }
}



module.exports = new BookController();

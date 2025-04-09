const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  image: {
    type: String, // lưu base64 string
    default: "",  // để trống nếu chưa upload
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bookSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;

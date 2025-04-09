const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    enum: ["percentage", "fixed"], // percentage: %, fixed: số tiền cố định
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  minOrderValue: {
    type: Number,
    default: 0, // giá trị đơn hàng tối thiểu để được giảm giá
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // số lượng lượt sử dụng còn lại
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  expiryDate: {
    type: Date,
    required: true,
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

promotionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;

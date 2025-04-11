const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: false, // Có thể cho phép khách lẻ
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
      title: String,
      sku: String,
      quantity: Number,
      price: Number,
    },
  ],
  note: {
    type: String,
    default: "",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "cancelled"],
    default: "paid",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);

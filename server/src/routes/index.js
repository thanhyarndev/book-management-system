const categoryRouter = require("./category");
const bookRouter = require("./book");
const promotionRouter = require("./promotion")
const userRouter = require("./user");
const customerRouter = require("./customer");
const orderRouter = require("./order");

function route(app) {
  app.use("/api/category", categoryRouter);
  app.use("/api/book", bookRouter);
  app.use("/api/promotion", promotionRouter);
  app.use("/api/user", userRouter);
  app.use("/api/customer", customerRouter);
  app.use("/api/order",  orderRouter);
}

module.exports = route;

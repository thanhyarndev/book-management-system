const categoryRouter = require("./category");
const bookRouter = require("./book");
const promotionRouter = require("./promotion")
const userRouter = require("./user");

function route(app) {
  app.use("/api/category", categoryRouter);
  app.use("/api/book", bookRouter);
  app.use("/api/promotion", promotionRouter);
  app.use("/api/user", userRouter);
}

module.exports = route;

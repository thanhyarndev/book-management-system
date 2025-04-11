const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const db = require("./config/db");
const route = require("./routes");

const port = 3001;

// Middleware
app.use(morgan("combined"));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect DB
db.connetct();

// Routes
route(app);

// Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

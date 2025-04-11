const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");

router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);
router.get("/phone/:phone", customerController.getCustomerByPhone);
router.post("/", customerController.createCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;

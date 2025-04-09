const CustomerModel = require("../models/Customer");
const LoyaltyDiscountModel = require("../models/LoyaltyDiscount")
const MonetaryNormModel = require("../models/MonetaryNorm")
class CustomerContronller {
  //lấy danh sách khách hàng
  async getCustomer(req, res) {
    try {
      const loyaltyDiscounts = await LoyaltyDiscountModel.find({ status: 'active' }).sort({ requiredPoints: -1 });
      if (!loyaltyDiscounts || loyaltyDiscounts.length === 0) {
        return res.status(404).json({ message: "No active loyalty discounts available" });
      }
  
      for (let customer of await CustomerModel.find()) {
        const eligibleDiscount = loyaltyDiscounts.find(discount => customer.point >= discount.requiredPoints);
        
        if (eligibleDiscount) {

          if (!customer.LoyaltyDicountId || customer.LoyaltyDicountId.toString() !== eligibleDiscount._id.toString()) {
            await CustomerModel.updateOne(
              { _id: customer._id },
              { $set: { LoyaltyDicountId: eligibleDiscount._id } }
            );
          }
        }
      }
  
      const customers = await CustomerModel.find().populate('LoyaltyDicountId');
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving or updating customers", error });
    }
  }
  
  
  async getCustomerByNumber(req, res) {
    const { phonenumber } = req.params;
    try {
      const customer = await CustomerModel.findOne({ phonenumber })
        .populate('LoyaltyDicountId')
      if (!customer) {
        return res.status(404).json({ message: "Customer not found", data: customer });
      }
      res.status(200).json({
        ...customer.toObject(),
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving customer", error });
    }
  }

  //lấy thông tin chi tiết của khách hàng theo id
  async getCustomerById(req, res) {
    const { id } = req.params;
    try {
      const customer = await CustomerModel.findById(id);

      if (!customer) {
        return res.status(404).json({ message: "customer not found" });
      }

      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving customer", error });
    }

  }
  //Tạo khách hàng mới


  //update khách hàng
  async updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phonenumber } = req.body;

    if (phonenumber.length !== 10)
      return res.status(400).json({ message: "Phone number must have 10 digits" })

    try {
      const updateCustomer = await CustomerModel.findByIdAndUpdate(
        id,
        { name, phonenumber },
        { new: true, runValidators: true },
      );
      if (!updateCustomer) {
        return res.status(404).json({ message: "customer not found" });
      }
      res.status(200).json(updateCustomer);
    } catch {
      res.status(500).json({ message: "Error updating customer" })
    }
  }

  //Xoa nhà cung câp
  async deleteCustomer(req, res) {
    const { id } = req.params
    try {
      const deleteCustomer = await CustomerModel.findByIdAndDelete(id)
      if (!deleteCustomer) {
        return res.json(404).json({ message: "customer not found" })
      }
      res.status(200).json("Deleted")
    } catch {
      res.status(500).json({ message: "Error deleting customer" })
    }
  }

  async createNewCustomer(req, res) {
    const { name, phonenumber, totalPriceAfterDiscount, invoiceType } = req.body

    if (phonenumber.length !== 10)
      return res.status(400).json({ message: "Phone number must have 10 digits" })

    if (!name || !phonenumber) {
      return res.status(400).json({ message: "Missing required fields" })
    }
    try {
      const existingCustomer = await CustomerModel.findOne({ phonenumber });
      if (existingCustomer) {
        return res.status(400).json({ message: "Please click check" });
      }

      // let applicableDiscountId = null;
      // if (invoiceType === 'shop') {
      //   const monetaryNorm = await MonetaryNormModel.findOne();
      //   if (!monetaryNorm) {
      //     return res.status(400).json({ message: 'Monetary norm not found' });
      //   }

      //   const loyaltyDiscounts = await LoyaltyDiscountModel.find({ status: 'active' });
      //   if (!loyaltyDiscounts || loyaltyDiscounts.length === 0) {
      //     return res.status(404).json({ message: "No active loyalty discounts available" });
      //   }

      //   const newPointCustomer = Math.round(totalPriceAfterDiscount / monetaryNorm.moneyPerPoint);

        
      //   loyaltyDiscounts.forEach((discount) => {
      //     if (newPointCustomer >= discount.requiredPoints) {
      //       if (!applicableDiscountId || loyaltyDiscounts.requiredPoints >= applicableDiscountId.requiredPoints)
      //         applicableDiscountId = discount
      //     }
      //   })
      // }

      const newCustomer = new CustomerModel({
        name,
        phonenumber,
      })

      await newCustomer.save()
      res.status(200).json({
        message: "Customer created successfully",
        customer: newCustomer,
      });


    } catch (error) {
      res.status(500).json({ message: "Error creating customer", error })
    }
  }
  //Caappj nhật điểm khách hàng từ hóa đơn
  async updatePointCustomerByInvoice(req, res) {
    const { id } = req.params;
    const { totalPriceAfterDiscount } = req.body;

    try {
      const monetaryNorm = await MonetaryNormModel.findOne();
      if (!monetaryNorm) {
        return res.status(400).json({ message: 'Monetary norm not found' });
      }

      const customer = await CustomerModel.findById(id)
      const newPointCustomer = Math.round(totalPriceAfterDiscount / monetaryNorm.moneyPerPoint);

      customer.point += newPointCustomer;
      await customer.save({ new: true });

      res.status(200).json({ message: 'Updated point customer', data: customer })
    } catch (error) {
      res.status(500).json({ message: "Error retrieving customer", error });
    }
  }

 

}
module.exports = new CustomerContronller();
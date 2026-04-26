const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

exports.getStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const ordersCount = await Order.countDocuments({ status: "Delivered" });
    const productsCount = await Product.countDocuments();

    // Calculate total revenue
    const orders = await Order.find({ status: "Delivered" });
    let totalRevenue = 0;
    orders.forEach(order => {
      totalRevenue += order.totalAmount;
    });

    res.status(200).json({
      success: true,
      stats: {
        users: usersCount,
        orders: ordersCount,
        products: productsCount,
        revenue: totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "firstName lastName email phoneNo address city zipCode")
      .populate("items.productId", "productName productPrice productImg");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
      .populate("userId", "firstName lastName email phoneNo address city zipCode")
      .populate("items.productId", "productName productPrice productImg");
    res.status(200).json({ success: true, order, message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user, message: "User role updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

exports.checkout = async (req, res) => {
  try {
    const { amount } = req.body;
    // Generate fake Razorpay Order ID
    const mockOrderId = "order_" + Math.random().toString(36).substring(2, 15);
    
    res.status(200).json({
      success: true,
      order: {
        id: mockOrderId,
        amount: amount * 100, // Normally represented in paise/cents
        currency: "INR"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, items, totalAmount, shippingAddress } = req.body;
    
    // Verify signature logic would normally be here. Fast-tracking to creating order.
    const newOrder = await Order.create({
      userId: req.id,
      items,
      totalAmount,
      paymentId,
      shippingAddress: shippingAddress || (req.user && req.user.address) || "Not provided"
    });

    // Clear user cart after checkout
    await Cart.findOneAndUpdate({ userId: req.id }, { items: [], totalPrice: 0 });

    res.status(200).json({
      success: true,
      message: "Payment successful & order created",
      order: newOrder
    });
  } catch (error) {
    console.error("verifyPayment Error", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.id })
      .populate('items.productId')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

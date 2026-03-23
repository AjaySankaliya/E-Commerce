const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// GET CART 
const getCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ success: true, cart: null });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a fresh cart
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1, price: product.productPrice }],
        totalPrice: product.productPrice,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Product already in cart — increment quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // New product — push to cart
        cart.items.push({ productId, quantity: 1, price: product.productPrice });
      }

      // Recalculate total
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }

    await cart.save();

    // Re-populate before sending back so frontend gets full product data
    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};

// UPDATE QUANTITY
const updateCartItem = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    cart.items[itemIndex].quantity = quantity;

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};

// REMOVE ITEM
const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};

// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
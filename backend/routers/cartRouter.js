const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { isAuthenticated } = require("../middleware/isAuthenticated");

const router = require("express").Router();

router.get("/get-cart", isAuthenticated, getCart);
router.post("/add-to-cart", isAuthenticated, addToCart);
router.put("/update-cart", isAuthenticated, updateCartItem);
router.delete("/remove-item/:productId", isAuthenticated, removeFromCart);
router.delete("/clear-cart", isAuthenticated, clearCart);

module.exports = router;
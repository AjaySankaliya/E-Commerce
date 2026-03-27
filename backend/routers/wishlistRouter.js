const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");

router.get("/", isAuthenticated, getWishlist);
router.post("/:productId", isAuthenticated, addToWishlist);
router.delete("/:productId", isAuthenticated, removeFromWishlist);

module.exports = router;

const Wishlist = require("../models/wishlistModel");

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.id }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.id, products: [] });
    }
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ userId: req.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.id, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }
    
    // populate before returning
    wishlist = await Wishlist.findOne({ userId: req.id }).populate("products");
    res.status(200).json({ success: true, message: "Added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: req.id },
      { $pull: { products: productId } },
      { new: true }
    ).populate("products");

    res.status(200).json({ success: true, message: "Removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

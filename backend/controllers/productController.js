const Product = require("../models/productModel");
const cloudinary = require("../utils/cloudinary");

const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "all field are required",
      });
    }

    const productImg = [];

    for (const files of req.files) {
      const result = await cloudinary.uploader.upload(files.path, {
        folder: "product",
      });
      productImg.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const newProduct = await Product.create({
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg,
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productName, productDesc, productPrice, category, brand } =
      req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    product.productName = req.body.productName || product.productName;
    product.productDesc = req.body.productDesc || product.productDesc;
    product.productPrice = req.body.productPrice || product.productPrice;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;

    if (req.files && req.files.length > 0) {
      for (let img of product.productImg) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      const images = [];

      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "product",
        });

        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      product.productImg = images;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};

module.exports = { 
  addProduct, 
  getAllProduct, 
  deleteProduct, 
  updateProduct,
  getProductById 
};

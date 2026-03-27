const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { checkout, verifyPayment, getUserOrders } = require("../controllers/paymentController");

router.post("/checkout", isAuthenticated, checkout);
router.post("/verify", isAuthenticated, verifyPayment);
router.get("/my-orders", isAuthenticated, getUserOrders);

module.exports = router;

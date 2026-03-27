const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { isAdmin } = require("../middleware/isAdmin");
const { getStats, getAllUsers, getAllOrders, updateOrderStatus } = require("../controllers/adminController");

router.get("/stats", isAuthenticated, isAdmin, getStats);
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.get("/orders", isAuthenticated, isAdmin, getAllOrders);
router.put("/orders/:orderId", isAuthenticated, isAdmin, updateOrderStatus);

module.exports = router;

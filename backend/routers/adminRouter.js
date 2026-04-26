const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { isAdmin } = require("../middleware/isAdmin");
const { getStats, getAllUsers, getAllOrders, updateOrderStatus, deleteUser, updateUserRole } = require("../controllers/adminController");

router.get("/stats", isAuthenticated, isAdmin, getStats);
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.get("/orders", isAuthenticated, isAdmin, getAllOrders);
router.put("/orders/:orderId", isAuthenticated, isAdmin, updateOrderStatus);
router.delete("/users/:userId", isAuthenticated, isAdmin, deleteUser);
router.put("/users/:userId/role", isAuthenticated, isAdmin, updateUserRole);

module.exports = router;

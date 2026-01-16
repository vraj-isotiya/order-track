const express = require("express");
const router = express.Router();

const { getOrderById } = require("../controllers/order.controller");
const { ipRateLimiter } = require("../middlewares/ipRateLimiter");

router.get("/:orderId", ipRateLimiter, getOrderById);

module.exports = router;

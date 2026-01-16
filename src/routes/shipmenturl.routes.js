const express = require("express");
const router = express.Router();

const { generateUpsTrackingLink } = require("../controllers/shipmenturl.controller");
const { ipRateLimiter } = require("../middlewares/ipRateLimiter");

router.get("/ups-link",ipRateLimiter, generateUpsTrackingLink);

module.exports = router;

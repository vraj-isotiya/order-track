const validator = require("validator");
const { fetchOrderById,fetchShipmentsByOrderId } = require("../services/bigcommerce.service");
const { successResponse } = require("../utils/apiResponse");
const { mapOrderResponseMinimal } = require("../utils/orderMapper");
const { mapShipmentsResponseMinimal } = require("../utils/shipmentMapper");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizePhone(phone) {
    // remove spaces, dashes, brackets, + sign etc.
  return String(phone || "").replace(/[^\d]/g, "");
}

exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { email, phone } = req.query; 

    const numericOrderId = Number(orderId);
    if (!Number.isInteger(numericOrderId) || numericOrderId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid orderId.",
      });
    }

    
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide email or phone for verification.",
      });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    const rawOrder = await fetchOrderById(numericOrderId);

    
    const billingEmail = rawOrder?.billing_address?.email || "";
    const billingPhone = rawOrder?.billing_address?.phone || "";

    
    const shippingEmail =
      rawOrder?.consignments?.[0]?.shipping?.[0]?.email || "";
    const shippingPhone =
      rawOrder?.consignments?.[0]?.shipping?.[0]?.phone || "";

    const orderEmails = [
      normalizeEmail(billingEmail),
      normalizeEmail(shippingEmail),
    ].filter(Boolean);

    const orderPhones = [
      normalizePhone(billingPhone),
      normalizePhone(shippingPhone),
    ].filter(Boolean);

    
    if (email) {
      const inputEmail = normalizeEmail(email);
      const emailMatched = orderEmails.includes(inputEmail);

      if (!emailMatched) {
        return res.status(403).json({
          success: false,
          message: "Email address or Order number does not match the order details.",
        });
      }
    }

    
    if (phone) {
      const inputPhone = normalizePhone(phone);
      const phoneMatched = orderPhones.includes(inputPhone);

      if (!phoneMatched) {
        return res.status(403).json({
          success: false,
          message: "Phone number or Order number does not match the order details.",
        });
      }
    }

    
    let shipments = [];
    try {
      const rawShipments = await fetchShipmentsByOrderId(numericOrderId);
      
      shipments = mapShipmentsResponseMinimal(rawShipments);
      
    } catch (shipmentErr) {
      // Optional: don’t fail order response if shipment API fails
        shipments = [];
    }

    
    const orderData = mapOrderResponseMinimal(rawOrder);

    return res.status(200).json(
      successResponse({
        message: "Order and shipment details retrieved successfully.",
        data: {
          ...orderData,
          shipments, 
        },
      })
    );

  } catch (err) {
    next(err);
  }
};

const axios = require("axios");

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN;
const API_VERSION = process.env.BIGCOMMERCE_API_VERSION || "v2";

if (!STORE_HASH || !ACCESS_TOKEN) {
  throw new Error(
    " Missing BIGCOMMERCE_STORE_HASH or BIGCOMMERCE_ACCESS_TOKEN in .env"
  );
}

const bigcommerceClient = axios.create({
  baseURL: `https://api.bigcommerce.com/stores/${STORE_HASH}/${API_VERSION}`,
  headers: {
    "X-Auth-Token": ACCESS_TOKEN,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

exports.fetchOrderById = async (orderId) => {
  try {
    const response = await bigcommerceClient.get(
      `/orders/${orderId}?include=consignments.line_items`
    );
    return response.data;
  } catch (error) {
    const statusCode = error.response?.status || 500;

    const bcMessage =
      error.response?.data?.title ||
      error.response?.data?.message ||
      error.message ||
      "BigCommerce API error";

    const err = new Error(bcMessage);
    err.statusCode = statusCode;
    err.details = error.response?.data || null;

    throw err;
  }
};

exports.fetchShipmentsByOrderId = async (orderId) => {
  try {
    const response = await bigcommerceClient.get(
      `/orders/${orderId}/shipments`
    );
    return response.data;
  } catch (error) {
    const statusCode = error.response?.status || 500;

    const bcMessage =
      error.response?.data?.title ||
      error.response?.data?.message ||
      error.message ||
      "BigCommerce Shipments API error";

    const err = new Error(bcMessage);
    err.statusCode = statusCode;
    err.details = error.response?.data || null;

    throw err;
  }
};

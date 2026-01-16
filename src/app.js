const express = require("express");
const helmet = require("helmet");
const shipmentRoutes = require("./routes/shipmenturl.routes");
const orderRoutes = require("./routes/order.routes");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/orders", orderRoutes);
app.use("/api/shipments", shipmentRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;

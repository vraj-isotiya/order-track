const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const shipmentRoutes = require("./routes/shipmenturl.routes");
const orderRoutes = require("./routes/order.routes");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

const corsOptions = {
  origin: "https://wilsoninmatepackageprogram.com/",
  methods: ["GET"],
};

app.use(cors(corsOptions));
//app.options("*", cors(corsOptions));

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

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

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const shipmentRoutes = require("./routes/shipmenturl.routes");
const orderRoutes = require("./routes/order.routes");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

const allowedOrigins = ["https://wilsoninmatepackageprogram.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server or tools like curl/postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);
app.options("*", cors());

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

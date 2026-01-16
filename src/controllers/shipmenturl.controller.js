exports.generateUpsTrackingLink = async (req, res, next) => {
  try {
    const { tracking_number } = req.query;

    if (!tracking_number || typeof tracking_number !== "string") {
      return res.status(400).json({
        success: false,
        message: "Tracking number is required.",
      });
    }

    const cleanTrackingNumber = tracking_number.trim();

    if (!cleanTrackingNumber) {
      return res.status(400).json({
        success: false,
        message: "Tracking number cannot be empty.",
      });
    }

    const trackingLink = `http://wwwapps.ups.com/WebTracking/processRequest?&tracknum=${encodeURIComponent(
      cleanTrackingNumber
    )}`;

    return res.status(200).json({
      success: true,
      message: "UPS tracking link generated successfully.",
      data: {
        tracking_number: cleanTrackingNumber,
        tracking_link: trackingLink,
      },
    });
  } catch (err) {
    next(err);
  }
};

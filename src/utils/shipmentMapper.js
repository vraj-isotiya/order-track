exports.mapShipmentsResponseMinimal = (shipments) => {
  if (!Array.isArray(shipments)) return [];

  return shipments.map((s) => ({
    id: s.id,
    tracking_number: s.tracking_number,
    shipping_method: s.shipping_method,
    shipping_provider_display_name: s.shipping_provider_display_name,
    generated_tracking_link: s.generated_tracking_link,
  }));
};

exports.mapOrderResponseMinimal = (order) => {
  if (!order || typeof order !== "object") return null;

  return {
    id: order.id,
    date_created: order.date_created,
    is_tax_inclusive_pricing: order.is_tax_inclusive_pricing,
    date_modified: order.date_modified,
    date_shipped: order.date_shipped,
    status: order.status,

    subtotal_ex_tax: order.subtotal_ex_tax,
    base_shipping_cost: order.base_shipping_cost,
    shipping_cost_inc_tax: order.shipping_cost_inc_tax,

    total_ex_tax: order.total_ex_tax,
    total_inc_tax: order.total_inc_tax,
    total_tax: order.total_tax,

    items_total: order.items_total,
    items_shipped: order.items_shipped,

    currency_code: order.currency_code,
    currency_exchange_rate: order.currency_exchange_rate,
    default_currency_code: order.default_currency_code,

    discount_amount: order.discount_amount,
    coupon_discount: order.coupon_discount,

    consignments: Array.isArray(order.consignments)
      ? order.consignments.map((c) => ({
          pickups: Array.isArray(c.pickups) ? c.pickups : [],
          shipping: Array.isArray(c.shipping)
            ? c.shipping.map((s) => ({
                first_name: s.first_name,
                last_name: s.last_name,
                company: s.company,
                street_1: s.street_1,
                street_2: s.street_2,
                city: s.city,
                zip: s.zip,
                country: s.country,
                country_iso2: s.country_iso2,
                state: s.state,
                email: s.email,
                phone: s.phone,
                form_fields: s.form_fields || [],

                line_items: Array.isArray(s.line_items)
                  ? s.line_items.map((li) => ({
                      name: li.name,
                      base_price: li.base_price,
                      price_ex_tax: li.price_ex_tax,
                      price_inc_tax: li.price_inc_tax,
                      total_ex_tax: li.total_ex_tax,
                      total_inc_tax: li.total_inc_tax,
                      quantity: li.quantity,
                      brand: li.brand,

                      product_options: Array.isArray(li.product_options)
                        ? li.product_options.map((po) => ({
                            display_name: po.display_name,
                            display_value: po.display_value,
                          }))
                        : [],

                      discounted_total_inc_tax: li.discounted_total_inc_tax,
                    }))
                  : [],

                items_total: s.items_total,
                items_shipped: s.items_shipped,

                base_cost: s.base_cost,
                cost_ex_tax: s.cost_ex_tax,
                cost_inc_tax: s.cost_inc_tax,

                shipping_zone_name: s.shipping_zone_name,
              }))
            : [],
        }))
      : [],

    custom_status: order.custom_status,
  };
};

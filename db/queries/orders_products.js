import db from "#db/client";

export async function addProductToOrder(orderId, productId, quantity) {
  const sql = `
    INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const {
    rows: [orderProduct],
  } = await db.query(sql, [orderId, productId, quantity]);
  return orderProduct;
}

export async function getProductsByOrderId(orderId) {
  const sql = `
    SELECT *
    FROM orders_products
    WHERE order_id = $1
  `;
  const { rows: orderProducts } = await db.query(sql, [orderId]);
  return orderProducts;
}

export async function getOrdersByProductIdForUser(productId, userId) {
  const sql = `
    SELECT op.*
    FROM orders_products op
    JOIN orders o ON op.order_id = o.id
    WHERE op.product_id = $1 AND o.user_id = $2
  `;
  const { rows: orderProducts } = await db.query(sql, [productId, userId]);
  return orderProducts;
}

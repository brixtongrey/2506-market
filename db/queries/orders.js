import db from "#db/client";

export async function createOrder(userId, date, note) {
  const sql = `
    INSERT INTO orders (user_id, date, note)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const {
    rows: [order],
  } = await db.query(sql, [userId, date, note]);
  return order;
}

export async function getOrdersByUser(userId) {
  const sql = `
    SELECT *
    FROM orders
    WHERE user_id = $1
  `;
  const { rows: orders } = await db.query(sql, [userId]);
  return orders;
}

export async function getOrderById(id) {
  const sql = `
    SELECT *
    FROM orders
    WHERE id = $1
  `;
  const {
    rows: [order],
  } = await db.query(sql, [id]);
  return order;
}

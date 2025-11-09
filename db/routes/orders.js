import express from "express";
import db from "#db/client";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import getUserFromToken from "#middleware/getUserFromToken";

const router = express.Router();

// attach user from token if exists 
router.use(getUserFromToken);

// create new order
router.post("/", requireUser, requireBody(["date"]), async (req, res) => {
  const { date } = req.body;
  const { rows: [order] } = await db.query(
    "INSERT INTO orders (user_id, date) VALUES ($1, $2) RETRNING *",
    [req.user.id, date]
  );
  res.status(201).send(order);
});

// get all orders of logged in users
router.get("/", requireUser, async (req, res) => {
  const { rows } = await db.query(
    "SELECT * FROM orders WHERE user_id = $1",
    [req.user.id]
  );
  res.send(rows);
});

// get specific order
router.get("/:id", requireUser, async (req, res) => {
  const { id } = req.params;
  const { rows: [order] } = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  if (!order) return res.status(404).send("Order not found");
  if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");
  res.send(order);
});

// add product to order
router.post("/:id/products", requireUser, requireBody(["productId", "quantity"]), async (req, res) => {
  const { id } = req.params;
  const { productId, quantity } = req.body;

  const { rows: [order] } = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  if (!order) return res.status(404).send("Order not found");
  if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");

  const { rows: [product] } = await db.query("SELECT * FROM products WHERE id = $1", [productId]);
  if (!product) return res.status(400).send("Product does not exist");

  const { rows: [op] } = await db.query(
    "INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
    [id, productId, quantity]
  );

  res.status(201).send(op);
});

// get all products in order 
router.get("/:id/products", requireUser, async (req, res) => {
  const { id } = req.params;
  const { rows: [order] } = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  if (!order) return res.status(404).send("Order not found");
  if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");

  const { rows: products } = await db.query(
    `SELECT p.*
     FROM products p
     JOIN orders_products op ON p.id = op.product_id
     WHERE op.order_id = $1`,
    [id]
  );

  res.send(products);
});

export default router;

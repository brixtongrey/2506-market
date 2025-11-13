import express from "express";
import db from "#db/client";
import requireUser from "#middleware/requireUser";
import getUserFromToken from "#middleware/getUserFromToken";

const router = express.Router();

// attach user from token if exists 
router.use(getUserFromToken);

// get all products
router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM products");
  res.send(rows);
});

// get product by id
router.get("/:id", async (req, res) => {
  const { rows: products } = await db.query(
    "SELECT * FROM products WHERE id = $1",
    [req.params.id]
  );
  if (!products[0]) return res.status(404).send("Product not found");
  res.send(products[0]);
});

// get orders that include product
router.get("/:id/orders", requireUser, async (req, res) => {
  const { id } = req.params;
  const { rows: product } = await db.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );
  if (!product[0]) return res.status(404).send("Product not found");

  const { rows: orders } = await db.query(
    `SELECT o.*
     FROM orders o
     JOIN orders_products op ON o.id = op.order_id
     WHERE op.product_id = $1 AND o.user_id = $2`,
    [id, req.user.id]
  );

  res.send(orders);
});

export default router;
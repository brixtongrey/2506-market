import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createProduct } from "#db/queries/products";
import { createOrder } from "#db/queries/orders";
import { addProductToOrder } from "#db/queries/orders_products";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {

   // create 1 user 
   const user = await createUser("bobsmith@gmail.com", "password123");

  // create 10 products
  const products = [];
  for (let i = 1; i <= 10; i++) {
    const product = await createProduct(
      `Product ${i}`,
      `Description for product ${i}`,
      i * 10.0
    );
    products.push(product);
   }

   // create 1 order belonging to bobsmith
   const order = await createOrder(user.id, "2025-02-02", "First order!");

  // add 5 specific products to that order
  for (let i = 0; i < 5; i++) {
    await addProductToOrder(order.id, products[i].id, 1);
  }
}

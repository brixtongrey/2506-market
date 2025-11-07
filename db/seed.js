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
   const productCatalog = [
    ["Wireless Mouse", "Bluetooth ergonomic mouse", 29.99],
    ["Laptop Stand", "Adjustable aluminum stand", 49.99],
    ["Mechanical Keyboard", "Clicky RGB keyboard", 89.99],
    ["USB-C Hub", "8-in-1 docking station", 39.99],
    ["Webcam", "1080p HD USB webcam", 59.99],
    ["Noise-Canceling Headphones", "Wireless ANC headphones", 129.99],
    ["Portable SSD", "1TB NVMe USB-C SSD", 139.99],
    ["HD Monitor", "27-inch 1080p", 199.99],
    ["Desk Lamp", "LED lamp with dimmer", 24.99],
    ["Smart Notebook", "Reusable digital notebook", 34.99],
   ];

   const products = [];

   for (const item of productCatalog) {
    const [title, description, price] = item;
    const product = await createProduct(title, description, price);
    products.push(product);
   }

   // create 1 user 
   const user = await createUser("bobsmith@gmail.com", "password123");

   // create 1 order belonging to bobsmith
   const order = await createOrder(user.id, "2025-02-02", "First order!");

  // add 5 specific products to that order
  for (let i = 0; i < 5; i++) {
    await addProductToOrder(order.id, products[i].id, 1);
  }
}

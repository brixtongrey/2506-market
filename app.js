import express from "express";

// routers
import usersRoute from "#db/routes/users";
import productsRouter from "#db/routes/products";
import ordersRouter from "#db/routes/orders";


// middleware
import getUserFromToken from "./middleware/getUserFromToken";

const app = express();

// built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// attach user if token exists
app.use(getUserFromToken);

// use routers
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.use((req, res) => {
    res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Internal Server Error");
});

export default app;

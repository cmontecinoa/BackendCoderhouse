import express from "express";
import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";

const app = express(); //Guardamos express en la variable app
const PORT = 8080;

//Middleware
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Bienvenida en Home:
app.get("/", (req, res) => {
  res.status(200).send("Bienvenido");
});

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


//Escuchando al server
app.listen(PORT, () => {
  console.log(`Escuchando en https://localhost:${PORT}...`);
});


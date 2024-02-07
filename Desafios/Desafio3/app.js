//npm i express, instalamos express.
//npm i nodemon -D, instalamos nodemon en el entorno de desarollo

import express from "express";
import ProductManager from "./src/controllers/productManager.js";

const app = express(); //Guardamos express en la variable app
const PORT = 8080;
const manager = new ProductManager();

//Middleware
app.use(express.json());

//Bienvenida en Home:
app.get("/", (req, res) => {
  res.status(200).send("Bienvenido");
});

//Listar todos los productos o hasta un limite:
app.get("/products", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await manager.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.log("Error al obtener los productos", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Traer un solo producto a traves de un identificador:
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await manager.getProductById(parseInt(id));

  product
    ? res
        .status(200) //Búsqueda exitosa
        .json({ message: `El producto con la id: ${id} es:`, product })
    : res
        .status(404) //Recurso solicitado no encontrado
        .json({ message: `Product id:${id} not found in database` });
});

app.listen(PORT, () => {
  console.log(`Escuchando en https://localhost:${PORT}...`);
});

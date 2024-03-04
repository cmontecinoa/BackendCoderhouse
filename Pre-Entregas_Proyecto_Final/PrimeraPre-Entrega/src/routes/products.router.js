import express from "express";
import ProductManager from "./../controllers/productManager.js";

const productsRouter = express.Router();
const manager = new ProductManager("./src/models/products.json");

//Products Routes
//Listar todos los productos o hasta un limite:
productsRouter.get("/", async (req, res) => {
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
productsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await manager.getProductById(parseInt(id));

  product
    ? res
        .status(200) //Búsqueda exitosa
        .json({ message: `El producto con la id: ${id}:`, product })
    : res
        .status(404) //Recurso solicitado no encontrado
        .json({ message: `Product id:${id} not found in database` });
});

//Agregar un nuevo producto por post:

productsRouter.post("/", async (req, res) => {
  const nuevoProducto = req.body;

  try {
    await manager.createProduct(nuevoProducto),
      res.status(201).json({ message: "Producto agregado!" });
  } catch (error) {
    console.log("Error al agregar un producto, Ojota!", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Actualizamos producto por id:

productsRouter.put("/:pid", async (req, res) => {
  let { pid } = req.params;
  const productoActualizado = req.body;

  try {
    await manager.updateProductById(parseInt(pid), productoActualizado);
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.log("No pudimos actualizar, vamos a morir", error);
    res.status(500).json({ error: "Para flaco, hay un error" });
  }
});

//Eliminar producto por id:

productsRouter.delete("/:pid", async (req, res) => {
  let { pid } = req.params;

  try {
    await manager.deleteProductById(parseInt(pid));
    res.json({ message: "Producto aniquilado correctamente" });
  } catch (error) {
    console.log("No pudimos eliminar esto eh, ojota", error);
    res.status(500).json({ error: "Para flaco, hay un error" });
  }
});

export default productsRouter;

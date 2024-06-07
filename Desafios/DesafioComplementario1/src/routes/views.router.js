import express from "express";
import ProductManager from "../controllers/productManagerDb.js";

const router = express.Router();
const productManager = new ProductManager("./src/models/productos.json");

//Punto 1
router.get("/", async (req, res) => {
  try {
    const productos = await productManager.getProducts();

    res.render("home.handlebars", { productos: productos });
  } catch (error) {
    console.log("Error al obtener los productos", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Punto 2
router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts.handlebars");
  } catch (error) {
    console.log("Error en la vista realtimeproducts", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;

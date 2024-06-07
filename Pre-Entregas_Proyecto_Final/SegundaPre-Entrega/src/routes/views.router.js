import express from "express";
import ProductManager from "../controllers/productManagerDb.js";
import CartManager from "../controllers/cartManagerDb.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

//Vista home
router.get("/", async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log("Error al obtener los productos", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Vista Productos
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 2 } = req.query;
    const productos = await productManager.getProducts({
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const arrayProductos = productos.docs.map((p) => {
      const { _id, ...rest } = p.toObject();
      return rest;
    });
    res.render("products", {
      productos: arrayProductos,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      currentPage: productos.page,
      totalPages: productos.totalPages,
    });
  } catch (error) {
    console.log("Error en la vista products", error);
    res
      .status(500)
      .json({ status: "error", error: "Error interno del servidor" });
  }
});

//Vista de carrito por ID
router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCarritoById(cartId);

    if (!cart) {
      console.log("No existe ese carrito con el id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productosEnCarrito = cart.products.map((item) => ({
      product: item.product.toObject(),
      //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars.
      quantity: item.quantity,
    }));

    res.render("carts", { productos: productosEnCarrito });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;

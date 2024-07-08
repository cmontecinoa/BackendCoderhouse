import express from "express";
import ProductManager from "../controllers/productManagerDb.js";
import CartManager from "../controllers/cartManagerDb.js";
import { isAuthenticated } from "../utils/isAuthenticated.js";
import { checkRole } from "../utils/checkRole.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

//Vista Login Home
router.get("/", (req, res) => {
  if (req.session.login) {
    return res.redirect("/products");
  }
  res.render("login");
});

// Ruta para Registro, si hay una sesion activa se redirecciona a los productos
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/failedRegister", (req, res) => {
  res.send({ error: "Registro fallido" });
});

///////////////////////////////////////////

//Vista Admin
router.get("/admin", checkRole("admin"), async (req, res) => {
  res.render("admin", { user: req.session.user });
});

//Vista Productos
router.get("/products", isAuthenticated, async (req, res) => {
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
      user: req.session.user,
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
router.get("/carts/:cid", isAuthenticated, async (req, res) => {
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

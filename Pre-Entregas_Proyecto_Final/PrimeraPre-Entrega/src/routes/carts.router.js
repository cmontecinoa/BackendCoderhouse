import express from "express";
import CartManager from "./../controllers/cartManager.js";

const cartsRouter = express.Router();
const manager = new CartManager("./src/models/carts.json");

//Carts Routes
//Crear un Nuevo Carrito

cartsRouter.post("/", async (req, res) => {
  try {
    const nuevoCart = await manager.crearCart();
    res.json(nuevoCart);
  } catch (error) {
    console.error("Error al crear un nuevo carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Listamos los productos que pertenecen a dicho carrito

cartsRouter.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);

  try {
    const cart = await manager.getCartById(cid);
    res.json(cart.products);
  } catch (error) {
    console.error("Error al obtener un carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Agregamos productos a distintos carritos

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const {pid} = req.params;
  const {quantity = 1} = req.body;  
  try{
    const actualizarCarrito = await manager.agregarProductoAlCarrito(cid,pid,quantity);
    res.json(actualizarCarrito.products);
  }catch(error){
    console.error("Error al agregar producto al carrito", error);
    res.status(500).json({error: "Error interno del servidor: "});

  }
});

export default cartsRouter;
  
import CartModel from "../models/cart.model.js";

class CartManager {
  async crearCarrito() {
    try {
      const nuevoCarrito = new CartModel({ products: [] });
      await nuevoCarrito.save();
      return nuevoCarrito;
    } catch (error) {
      console.log("Error al crear un carrito nuevo", error);
      throw error;
    }
  }

  async getCarritoById(cartId) {
    try {
      const carrito = await CartModel.findById(cartId);

      if (!carrito) {
        console.log("Error al identificar carrito con ID");
        return null;
      }

      console.log("El carrito solicitado es el siguiente: ", carrito);
      return carrito;
    } catch (error) {
      console.log("Error al obtener un carrito por ID", error);
      throw error;
    }
  }

  async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
    try {
      const carrito = await this.getCarritoById(cartId);
      const existeProducto = carrito.products.find(
        (item) => item.product.toString() === productId
      );

      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        carrito.products.push({ product: productId, quantity });
      }

      //Cuando modifican tienen que marcarlo con "markModified"
      //Marcamos la propeidad "products" como modificada
      carrito.markModified("products");
      console.log("El siguiente carrito se reflejerá en la DB: ", carrito);
      await carrito.save();
      return carrito;
    } catch (error) {
      console.log("Error al agregar un producto!");
      throw error;
    }
  }
}

export default CartManager;

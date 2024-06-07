import CartModel from "../models/cart.model.js";

class CartManager {
  //Crear
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
  //Leer
  async getCarritoById(cartId) {
    try {
      const carrito = await CartModel.findById(cartId);

      if (!carrito) {
        console.log("Error al identificar carrito con ID");
        return null;
      }
      return carrito;
    } catch (error) {
      console.log("Error al obtener un carrito por ID", error);
      throw error;
    }
  }
  // Update product +1
  async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
    try {
      const carrito = await this.getCarritoById(cartId);
      const existeProducto = carrito.products.find(
        (item) => item.product._id.toString() === productId
      );

      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        carrito.products.push({ product: productId, quantity });
      }
      //Marcamos la propiedad "products" como modificada
      carrito.markModified("products");
      // console.log("El siguiente carrito se reflejerá en la DB: ", carrito);
      await carrito.save();
      return carrito;
    } catch (error) {
      console.log("Error al agregar un producto!");
      throw error;
    }
  }
  //Update cart
  async actualizarCarrito(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = updatedProducts;
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al actualizar el carrito en el gestor", error);
      throw error;
    }
  }
  //Update cantidad de product
  async actualizarCantidadDeProducto(cartId, productId, newQuantity) {
    try {
      console.log("Intenando Actualizar por cantidad de productos");
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;
        cart.markModified("products");
        await cart.save();
        return cart;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad del producto en el carrito",
        error
      );
      throw error;
    }
  }

  //Delete Product
  async eliminarProductoDelCarrito(cartId, productId) {
    try {
      console.log("Intentando eliminar producto desde función...");
      const cart = await CartModel.findById(cartId);
      const cartWithProduct = cart.products.findIndex(
        (i) => i.product._id.toString() == productId
      );

      if (!cart) {
        throw new Error("Carrito no encontrado!");
      }

      if (cartWithProduct === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }

      cart.products = cart.products.filter(
        (i) => i.product._id.toString() !== productId
      );
      await cart.save();
      return cart;
    } catch (error) {
      console.error(
        "Error al eliminar el producto del carrito en el gestor: ",
        error
      );
    }
  }
  //Delete Cart
  async vaciarCarrito(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return cart;
    } catch (error) {
      console.log("Error al vaciar el carrito en el gestor", error);
    }
  }
}

export default CartManager;

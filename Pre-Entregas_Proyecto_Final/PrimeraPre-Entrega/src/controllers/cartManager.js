import * as fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.lastId = 0; // Se utilizará para almacenar una lista de carts dentro de la instancia de esta clase
    this.cargarCarts(); //Llamar método reservado para cargar carritos:
  }

  //Método para cargar carrito
  async cargarCarts() {
    try {
      const dataFile = await fs.promises.readFile(this.path, "utf8");
      this.carts = JSON.parse(dataFile);

      if (this.carts.length > 0) {
        //Verificar si hay algun cart en el archivo, si es así:
        this.lastId = Math.max(...this.carts.map((cart) => cart.id)); //Se devuelve el mayor valor en el mapeo de los carritos, pasando por cada id, y asignandolo al atributo de la clase.
      }
    } catch (error) {
      console.error("Error al cargar los carritos desde el archivo", error);
      // Si no puede ejecutar el código del try, crear el archivo:
      console.log("Creando archivo para carts...");
      await this.guardarCarts();
    }
  }

  //Método para actualizar Carritos
  async guardarCarts() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2)
      );
    } catch (error) {
      console.error("Error al guardar los carritos en el archivo", error);
      throw error;
    }
    return
  }

  //Método para crear Carrito
  async crearCart() {
    const nuevoCart = {
      id: ++this.lastId,
      products: [],
    };

    this.carts.push(nuevoCart);

    //Guardamos el atributo array en el archivo indicado en la path
    await this.guardarCarts();
    return nuevoCart;
  }

  //Método para buscar Carrito por ID
  async getCartById(cartId) {
    try {
      const cart = this.carts.find((c) => c.id === cartId);
      if (!cart) {
        throw new Error(`No existe ningún carrito con el id : ${cartId}`);
      }
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito por esta ID", error);
      throw error;
    }
  }

  //Método para Agregar un producto al Carrito

  async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
    const cart = await this.getCartById(cartId);
    const existeProducto = cart.products.find((p) => p.product === productId);

    if (existeProducto) {
      existeProducto.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await this.guardarCarts();
    return cart;
  }
}

export default CartManager;

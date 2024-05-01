import * as fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.productos = []; // Probablemente se utilizará para almacenar una lista de productos dentro de la instancia de esta clase
  }
  static lastId = 0;

  //Método para leer archivo:
  async readProducts() {
    // console.log(this.path); // Testing path...
    try {
      if (fs.existsSync(this.path)) {
        // Método de fs que devuelve booleano si es que existe o no un archivo en dicho path
        const productsFile = await fs.promises.readFile(this.path, "utf-8");
        //Lectura de productos.json para guardar en variable productFile
        const productsRead = JSON.parse(productsFile);
        return productsRead;
      } else {
        return;
      }
    } catch (error) {
      console.log("ProductManager(ReadProducts): Aquí aun no hay productos...");
      return error;
    }
  }

  //Método para devolver productos
  async getProducts() {
    try {
      const arrayProducts = await this.readProducts();
      return arrayProducts;
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  //Método para crear producto y escribirlo en archivo
  async createProduct(product) {
    try {
      const products = await this.getProducts();
      let newId;

      if (products.length > 0) {
        newId =
          products.reduce((maxId, product) => Math.max(maxId, product.id), 0) +
          1;
      } else {
        newId = 1;
      }

      if (products.some((p) => p.code === product.code)) {
        console.log("El código debe ser único");
        return;
      } else {
        products.push({ id: newId, ...product, status: true });

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, 2)
        );

        console.log("Objeto creado exitosamente crack!");
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  }

  //Método para cojer un producto por su ID
  async getProductById(id) {
    try {
      const products = await this.getProducts(); //Cargar los productos
      const product = products.find((p) => p.id === id);
      if (!product) {
        return "No product in Database";
      } else {
        return product;
      }
    } catch (error) {
      return error;
    }
  }

  //Método para eliminar a un producto por su ID
  async deleteProductById(id) {
    try {
      const products = await this.getProducts(); //Cargar los productos
      const newArrayOfProducts = products.filter((p) => p.id !== id);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(newArrayOfProducts, null, 2)
      );
    } catch (error) {
      return error;
    }
  }

  //Método para actualizar un producto por su ID
  async updateProductById(id, obj) {
    try {
      const products = await this.getProducts(); //Cargar los productos
      const indexOfProduct = products.findIndex((prod) => prod.id === id); // Index del array en caso de no encontrarlo devuelve -1

      if (indexOfProduct < 0) {
        console.log("No product in Database");
        return;
      } else {
        console.log("Starting Update...");
        const oldProduct = products[indexOfProduct];
        console.log(oldProduct);
        console.log("Updating...");
        const updateProduct = Object.assign(oldProduct, obj);
        console.log(updateProduct);
        products.splice(indexOfProduct, 1, updateProduct);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, 2)
        );
        console.log("Product Updated Sucefully!");
        return;
      }
    } catch (error) {
      return error;
    }
  }
}

export default ProductManager;

const fs = require("fs");

class ProductManager {
  constructor() {
    this.path = "productsFile.json";
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const productFile = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(productFile);
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  }

  async createProduct(product) {
    try {
      const products = await this.getProducts();
      let id;
      if (!products.length) {
        id = 1;
      } else {
        id = products[products.length - 1].id + 1;
      }
      products.push({ id, ...product });

      await fs.promises.writeFile(this.path, JSON.stringify(products));
      console.log("Objeto creado!");
    } catch (error) {
      return error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id === id);
      if (!product) {
        return "No user in Database";
      } else {
        return product;
      }
    } catch (error) {
      return error;
    }
  }

  async deleteProductById(id) {
    try {
      const products = await this.getProducts();
      const newArrayOfProducts = products.filter((p) => p.id !== id);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(newArrayOfProducts)
      );
    } catch (error) {
      return error;
    }
  }

  async updateProductById(id, obj) {
    try {
      const products = await this.getProducts(); //Carga los productos
      const indexOfProduct = products.findIndex((prod) => prod.id === id); // Index del array en caso de no encontrarlo devuelve -1

      if (indexOfProduct > 0) {
        console.log("No user in Database");
        return;
      } else {
        console.log("Starting Update...");
        // console.log(indexOfProduct);
        const oldProduct = products[indexOfProduct];
        console.log(oldProduct);
        console.log("Updating...")
        const updateProduct = Object.assign(oldProduct, obj);
        console.log(updateProduct);

        products.splice(indexOfProduct, 1, updateProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products));
        console.log("Product Updated Sucefully!");
        return;
      }
    } catch (error) {
      return error;
    }
  }
}

const product1 = {
  title: "Laptop",
  description: "Dell I5 8GB ",
  price: 20000,
  thumbnail: "ImageExample",
  code: "#101",
  stock: "20",
};

const product2 = {
  title: "Cellphone",
  description: "Acer I5 8GB ",
  price: 25000,
  thumbnail: "ImageExample",
  code: "#102",
  stock: "20",
};

async function test() {
  const manager1 = new ProductManager();

  //Eliminar Archivo JSON

  // Crear Productos
  // await manager1.createProduct(product1); // Crear Producto
  // await manager1.createProduct(product2); // Crear producto

  // Leer Productos
  // const products = await manager1.getProducts()
  // console.log(products);

  // Borrar Productos
  // await manager1.deleteProductById(2)

  //Leer Productos por ID
  // console.log(await manager1.getProductById(1));

  // Editar Productos por ID
  await manager1.updateProductById(1,{title:'Netbook'});   //Editar producto
}

test();

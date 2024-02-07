class ProductManager {
  static lastId = 0;

  constructor() {
    this.products = [];
  }

  getProducts() {
    console.log(this.products);
    return;
  }

  addProduct(productExample) {
    const { name, description, price, thumbnail, code, stock } = productExample;

    if (!name || !description || !price || !thumbnail || !code || !stock) {
      console.log("Invalid Data for add Product");
      return;
    }

    const isCodeIn = this.products.some((p) => p.code === code);

    if (isCodeIn) {
      console.log("Code already exist in products");
      return;
    }

    // let id;
    // if(!this.products.length){
    //     id = 1;
    // }else{
    //     id = this.products[this.products.length - 1].id + 1;
    // }

    const newProduct = {
      id: ++ProductManager.lastId,
      ...productExample,
    };

    this.products.push(newProduct);
    console.log("Product Added");
    return;
  }

  getProductById(idProduct) {
    const product = this.products.find((p) => p.id === idProduct);

    if (!product) {
      console.log("Not Found Product");
      return;
    }

    console.log("Found Product");
    return product;
  }
}

// Proceso de Testing

// 1) Se creará una instancia de la clase "ProductManager"
const manager1 = new ProductManager();

//2) Se llamará "getProducts" recién creada la instancia, debe devolver un arreglo vacío.
manager1.getProducts();

//3) Se llamará al método "addProduct" y se asignarán los valores a sus respectivos campos:

manager1.addProduct({
  name: "ProductoPrueba",
  description: "esto es un producto de prueba",
  price: 200,
  thumbnail: "sin imagen",
  code: "0001",
  stock: 25,
});
//4) El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE

manager1.addProduct({
  name: "Laptop",
  description: "esto es un producto de prueba",
  price: 1000,
  thumbnail: "sin imagen",
  code: "0002",
  stock: 30,
});

manager1.addProduct({
  name: "AirPads",
  description: "esto es un producto de prueba",
  price: 2500,
  thumbnail: "sin imagen",
  code: "0003",
  stock: 5,
});

//5) Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado

manager1.getProducts();

//6) Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.

manager1.addProduct({
  name: "ItemTest",
  description: "esto es un producto de prueba",
  price: 3000,
  thumbnail: "sin imagen",
  code: "0001", // Invalid
  stock: 1,
});

//7) Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo

manager1.getProductById(1);
manager1.getProductById(4);

// Atento a sus comentarios tutor, un saludo!


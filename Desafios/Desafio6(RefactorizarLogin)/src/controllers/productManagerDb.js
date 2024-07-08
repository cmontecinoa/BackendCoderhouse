import ProductModel from "../models/product.model.js";

class ProductManager {
  //Agregar un Producto
  async addProduct({
    title,
    description,
    price,
    code,
    category,
    stock,
    thumbnails,
  }) {
    try {
      if (
        !title ||
        !description ||
        !price ||
        !code ||
        !category ||
        !stock ||
        thumbnails
      ) {
        console.log(
          "No se puede agregar producto, todos los campos son obligatorios"
        );
        return;
      }

      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        console.log("El código tiene que ser único para cada producto");
        return;
      }

      const nuevoProducto = new ProductModel({
        title, //Esto es lo mismo que decir title:title. A causa del sweet syntax
        description,
        price,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      });

      await nuevoProducto.save();
    } catch (error) {
      console.log("Error al agregar un producto a la BD", error);
      throw error;
    }
  }
  //Mostrar Productos

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const skip = (page - 1) * limit;

      let queryOptions = {};

      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort == "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      const productos = await ProductModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
      // const productos = await ProductModel.find();
      // return productos;

      const totalProducts = await ProductModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sortOptions}&query=${queryOptions}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sortOptions}&query=${queryOptions}`
          : null,
      };
    } catch (error) {
      console.log("Error al recuperar los productos de la BD", error);
      throw error;
    }
  }

  //Mostrar Producto por ID
  async getProductById(id) {
    try {
      const producto = await ProductModel.findById(id);

      if (!producto) {
        console.log("No se encuentro un producto con ese parámetro de ID");
        return null;
      }

      console.log("Producto Encontrado");
      return producto;
    } catch (error) {
      console.log("Error al recuperar producto por ID", error);
      throw error;
    }
  }

  //Actualizar Producto
  async updateProductById(id, productoActualizando) {
    try {
      console.log("The add is that:", productoActualizando);
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizando
      );
      if (!updatedProduct) {
        console.log("Producto no encontrado para actualizar!");
        return null;
      }
      console.log("Producto Actualizado:", updatedProduct);

      return updatedProduct;
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      throw error;
    }
  }

  //Eliminar Producto

  async deleteProduct(id) {
    try {
      const deleteProduct = await ProductModel.findByIdAndDelete(id);
      if (!deleteProduct) {
        console.log("Producto no encontrado para su eliminación!");
        return null;
      }
      console.log("Producto Eliminado con éxito");
      return;
    } catch (error) {
      console.log("Error al eliminar producto", error);
      throw error;
    }
  }
}

export default ProductManager;

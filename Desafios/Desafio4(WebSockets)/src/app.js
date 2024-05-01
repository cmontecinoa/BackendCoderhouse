//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Importaciones
import express from "express";
import exphbs from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { Server as socket } from "socket.io"; // Ojota acá, que se importa la clase server!
import ProductManager from "./controllers/productManager.js";

// Creación del Servidor
const app = express();
const PUERTO = 8080;

// Configuramos handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware
app.use(express.static("./src/public"));

//Routing
app.use("/", viewsRouter);
app.use("/realtimeproducts", viewsRouter);

// Obtención del array de productos:
const productManager = new ProductManager("./src/models/productos.json");

// Iniciamos el servidor (#)
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando el servidor en el puerto: ${PUERTO}`);
});

// Creamos el server de Socket.ip
const io = new socket(httpServer);
// Ahora "io" es la herramienta(instancia) a la cual acudiremos cada vez que quiera enviar un mensaje desde el servidor hacia el cliente.

io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado al servidor");

  //Enviamos el array de productos al cliente que se conectó:
  socket.emit("productos", await productManager.getProducts());

  //Recibimos el evento "eliminarProducto" en la App desde el cliente:
  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProductById(id);
    //Y ahora debo enviarle la lista actualizada al cliente desde la App:
    io.sockets.emit("productos", await productManager.getProducts());
  });

  socket.on("agregarProducto", async (producto) => {
    await productManager.createProduct(producto);
    io.sockets.emit("productos", await productManager.getProducts());
  });
});

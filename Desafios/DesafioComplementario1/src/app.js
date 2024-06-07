//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Importaciones
import express from "express";
import exphbs from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import connectDB from "./config/db.js";
// import { Server as socket } from "socket.io"; // Ojota acá, que se importa la clase server!

// Creación del Servidor
const app = express();
const PUERTO = 8080;

// Configuramos handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routing

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
// app.use("/", viewsRouter);

// app.use("/realtimeproducts", viewsRouter);

// Iniciamos el servidor (#)
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando el servidor en el puerto: ${PUERTO}`);
});

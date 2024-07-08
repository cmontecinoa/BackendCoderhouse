//Importaciones
import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
//Importaciones de enrutadores:
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import userRouter from "./routes/user.router.js";
//Archivo de conexión a BD
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// Creación del Servidor
const app = express();
const PUERTO = 8080;
dotenv.config();
connectDB();

// Configuramos handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://cmontecinoa:coderhouse@clustercma.iuodlod.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ClusterCma",
      ttl: 100,
    }),
  })
);

//Routing
app.use("/", viewsRouter);
app.use("/api/session", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/user", userRouter);

// Iniciamos el servidor (#)
const http = app.listen(PUERTO, () => {
  console.log(`Escuchando el servidor en el puerto: ${PUERTO}`);
});

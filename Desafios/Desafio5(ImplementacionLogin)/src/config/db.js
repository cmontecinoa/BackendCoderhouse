//Conexión de la app con MongoDB

//1) Instalamos mongoose: npm i mongoose.
import mongoose from "mongoose";

//2) Crear una conexión con la base datos
const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://cmontecinoa:coderhouse@clustercma.iuodlod.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ClusterCma"
    )
    .then(() => console.log("Conexión exitosa"))
    .catch(() => console.log("Error en la conexión de BBDD"));
};
export default connectDB;

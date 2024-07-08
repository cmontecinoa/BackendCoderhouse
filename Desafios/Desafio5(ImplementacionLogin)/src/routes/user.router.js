import express from "express";
import UserModel from "../models/user.model.js";
const router = express.Router();

//Crear un Nuevo Usuario...
router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age, role } = req.body;
  try {
    //Verificar si el correo ya esta registrado en la base de datos:
    const existeUsuario = await UserModel.findOne({ email: email });
    if (existeUsuario) {
      return res
        .status(400)
        .send({ error: "El email ya está registrado en la BD" });
    }

    //Si no lo encuentra, creamos el nuevo usuario con mongoose:
    const nuevoUsuario = await UserModel.create({
      first_name,
      last_name,
      password,
      email,
      age,
      role,
    });

    //Almacenamos la info del usuario en la session actual:
    req.session.login = true;
    req.session.user = { ...nuevoUsuario._doc };
    //Redireccionamos a la vista del perfil
    res.redirect("/products");
  } catch (error) {
    console.log("Error al crear el nuevo Usuario");
    res.status(500).send({ error: "Error al guardar el usuario Nuevo" });
  }
});

export default router;

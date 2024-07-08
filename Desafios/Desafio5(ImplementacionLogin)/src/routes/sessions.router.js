import express from "express";
import UserModel from "../models/user.model.js";
const router = express.Router();

//Ruta Post para Login
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Si las credenciales coinciden con las del admin
      req.session.login = true;
      req.session.user = { email: process.env.ADMIN_EMAIL, role: "admin" };
      return res.redirect("/admin");
    }
    //Primeramente, buscamos al usuario en la BD de MongoAtlas
    const usuario = await UserModel.findOne({ email: email });
    //Si existe el usuario se rescata en la variable usuario, luego validamos la pass
    if (usuario) {
      if (usuario.password === password) {
        //Si la contraseña coincide con la contraseña rescatada desde el body:
        req.session.login = true;
        req.session.user = { ...usuario._doc };
        //Si se crea la session, se redirecciona al profile:
        // if (usuario.role === "admin") {
        //   res.redirect("/admin");
        // }
        res.redirect("/products");
      } else {
        res.status(404).send({ error: "Contraseña no valida!" });
      }
    } else {
      res.status(404).send({ error: "Usuario no encontrado en la BD" });
    }
  } catch (error) {
    res.status(400).send({ error: "Error en el login" });
  }
});

//Ruta get para deslogearse y redireccionamiento a pagina del login(main)
router.post("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy((error) => {
      if (error) {
        return res
          .status(500)
          .send("Hubo un problema al intentar cerrar la sesión");
      }
    });
  }
  res.redirect("/");
});

export default router;

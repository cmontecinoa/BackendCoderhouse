import express from "express";
import passport from "passport";
const router = express.Router();

// Version Login con Passport LOCAL
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // Verificar si las credenciales corresponden al administrador
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.login = true;
    req.session.user = {
      email: process.env.ADMIN_EMAIL,
      role: "admin",
      name: process.env.ADMIN_NAME,
    };
    return res.redirect("/admin");
  }

  // Si no son las credenciales del administrador, proceder con Passport
  passport.authenticate("login", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/api/session/failLogin");  //Redirigir en caso de fallo de autenticación...
    }

    //Establecer la sesión con express:
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        role: user.role,
      };
      req.session.login = true;

      return res.redirect("/products");
    });
  })(req, res, next); //Invocar el middleware de Passport
});

//Versión para GitHub:
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  }),
  async (req, res) => {}
);
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    //La estrategia de GitHub me va a retornar el usuario, entonces lo agregamos y creamos una sesión:
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/products");
  }
);

//FailLogin
router.get("/failLogin", async (req, res) => {
  res.send({ error: "Fallo el Login!" });
});

///////////////////////////////////////////////////////////////////////////////////

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

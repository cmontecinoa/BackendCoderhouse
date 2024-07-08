import express from "express";
const router = express.Router();
import passport from "passport";

//Registro con Passport
router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/failedRegister",
    failureMessage: true,
  }),
  async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error" });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    };
    req.session.login = true;
    //Redireccionamos a la vista del ecommerce
    res.redirect("/products");
  }
);

export default router;

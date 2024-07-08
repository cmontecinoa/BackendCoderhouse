//npm i passport passport-local
//Importamos los modules de Passport:
import passport from "passport";
import local from "passport-local";

//Estrategia de GitHub para Passport
import GitHubStrategy from "passport-github2";

//Importamos UserModel y las funciones de bcrypt
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";

const LocalStrategy = local.Strategy; // Generador de estrategias con passport

const initializePassport = () => {
  //Estrategia para REGISTRO:
  passport.use(
    "register", //Nombre de la estrategia
    new LocalStrategy(
      {
        passReqToCallback: true, // Acceso al objeto request
        usernameField: "email",
      },
      async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;
        
        try {
          //Verificación si ya existe el email en nuestros registros
          let userDup = await UserModel.findOne({ email: email });
          if (userDup)
            return done(null, false, { message: "El usuario ya existe" });
          //Si no esta duplicado el email, procede a crear un nuevo user
          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          let result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //Estrategia para LOGIN:
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          //Primero se verifica si existe un usuario con dicho email en la BD
          const user = await UserModel.findOne({ email });
          if (!user) {
            console.log("Este usuario no existe en la BD");
            return done(null, false);
          }
          //En caso de existir, se verifica la pass:
          if (!isValidPassword(password, user)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    //Serializar utiliza el ID del usuario.
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    //Deserializar utiliza el objeto usuario.
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  //Github Strategy
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv23liJlUaM3ltRWy9Uj",
        clientSecret: "6ac85c33eca57df2ac1cf0c5800402ff3bc143fc",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        //Opcional: si se quiere ver como llega el perfil del usuario:
        console.log(profile);
        try {
          let user = await UserModel.findOne({ email: profile._json.email });
          //Si no encuentro ningun usuario con el email, procede a crearlo:
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "secret",
              age: 28,
              email: profile._json.email,
              password: "secret",
            };
            //Una vez tenemos el nuevo usuario, se guarda en MongoDB:
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export { initializePassport };

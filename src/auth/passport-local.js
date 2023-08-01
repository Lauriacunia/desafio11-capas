import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import { Strategy as LocalStrategy } from "passport-local";
// passport-github2
import { Strategy as GitHubStrategy } from "passport-github2";
import MongoDBUsers from "../daos/mongo/MongoDBUsers.js";
import { MongoDBCarts } from "../daos/mongo/MongoDBCarts.js";
import { encryptPassword, comparePassword } from "../config/bcrypt.js";
const db = new MongoDBUsers();
const dbCarts = new MongoDBCarts();

const localStrategy = LocalStrategy;
const githubStrategy = GitHubStrategy;

// variables de entorno
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/** Nota:
 *  Passport guarda los datos del usuario autenticado
 *  en la propiedad user del objeto req durante la autenticación
 *  y crea la sesión (ver en app.js "app.use(passport.session()); // Enlaza passport con la sesion").
 *  Luego, en cada petición, se puede acceder a los datos del usuario
 *  autenticado con req.user.
 */
passport.use(
  "register",
  new localStrategy(
    {
      /**Por default espera un username y un password.
       * Pero se pueden cambiar los nombres de los campos con usernameField y passwordField
       */
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, //Para que el callback reciba el req completo,
    },
    async (req, email, password, done) => {
      // done es un callback que se ejecuta cuando termina la funcion
      const usuarioSaved = await db.getUserByEmail({ email });
      if (usuarioSaved) {
        req.flash(
          "errorMessage",
          "El usuario ya existe en nuestra Base de datos. Por favor, elija otro nombre de usuario."
        );
        return done(null, false);
      } else {
        const hashPass = await encryptPassword(password);
        /** create new Cart */
        const newCart = await dbCarts.create();
        const newUser = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          age: req.body.age,
          cart: newCart._id,
          password: hashPass,
          role: req.body.role || "user",
        };
        const response = await db.create(newUser);
        console.log("Nuevo usuario registrado: ", response);
        return done(null, response);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, //Para que el callback reciba el req completo
    },
    async (req, email, password, done) => {
      // aunque no se use el req, hay que ponerlo para que funcione
      // done es un callback que se ejecuta cuando termina la funcion

      const usuarioSaved = await db.getUserByEmail({ email });
      if (!usuarioSaved) {
        req.flash(
          "errorMessage",
          "El usuario ingresado no existe. Por favor, regístrese."
        );
        return done(null, false);
      }
      const isTruePassword = await comparePassword(
        password,
        usuarioSaved.password
      );
      if (!isTruePassword) {
        req.flash(
          "errorMessage",
          "La contraseña ingresada es incorrecta. Por favor, intente nuevamente."
        );
        return done(null, false);
      }

      return done(null, usuarioSaved);
    }
  )
);

/** hay dos funciones que passport necesita para trabajar con los ids de los usuarios
 * en toda la app:
 * serializeUser: para guardar el id del usuario en la sesion
 * deserializeUser: para obtener el usuario de la base de datos por el id */
passport.serializeUser((user, done) => {
  done(null, user.id); // _id de mongo
});

passport.deserializeUser(async (id, done) => {
  const user = await db.getOne(id);
  done(null, user);
});

// middleware para proteger rutas
function isAuth(req, res, next) {
  /**
   * req.isAuthenticated() es una función propia de passport que
   * verifica que el usuario este autenticado.
   */
  if (req.isAuthenticated()) {
    // Si esta autenticado sigue con la ejecucion que queremos
    return next();
  }
  res.redirect("/auth/login");
}
/** AUTHENTICATION - GITHUB */
passport.use(
  new githubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Aquí puedes manejar los datos del usuario autenticado
      // profile contiene la información del usuario
      const user = {
        username: profile.username,
        password: null, // no tenemos password pero lo necesita el modelo
      };
      const userSaved = await db.getUserByUsername({ username: user.username });
      if (userSaved) {
        return done(null, userSaved);
      } else {
        const response = await db.create(user);
        return done(null, response);
      }
    }
  )
);

export { passport, isAuth };

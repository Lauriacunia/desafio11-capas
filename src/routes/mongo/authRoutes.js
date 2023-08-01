import passport from "passport";
import { Router } from "express";
const router = Router();

//vista de login
router.get("/login", (req, res) => {
  res.render("login");
});

// vista de register
router.get("/register", (req, res) => {
  res.render("register");
});

// register post
router.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "/auth/login",
    failureRedirect: "/error",
    failureFlash: true, // Habilitar mensajes flash
  })
);

// login post
router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/error",
    failureFlash: true, // Habilitar mensajes flash
  })
);

// obtener el usuario autenticado actualmente
router.get("/current", (req, res) => {
  res.json(req.user);
});

router.get("/logout", (req, res) => {
  // Hace logout y elimina la sesión del usuario autenticado
  console.log("req.logout", req.logout);
  req.logout(function (err) {
    if (err) {
      // Maneja el error de logout
      console.error(err);
      // Redirige a una página de error o manejo de errores
      return res.redirect("/error");
    }

    // Redirige al usuario a la ruta de autenticación
    res.render("login");
  });
});

/** rutas de auth con github */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/error" }),
  (req, res) => {
    // Redirige al usuario a la página deseada después de iniciar sesión correctamente
    res.redirect("/home");
  }
);
export default router;

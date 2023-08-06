import passport from "passport";
import { Router } from "express";
const router = Router();
import {
  viewLogin,
  viewRegister,
  getCurrentUser,
  logout,
  redirectToHome,
} from "../../controllers/auth.controller.js";

router.get("/login", viewLogin);
router.get("/register", viewRegister);
/**passport lo dejo acá como middleware */
router.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "/auth/login",
    failureRedirect: "/error",
    failureFlash: true,
  })
);

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/error",
    failureFlash: true,
  })
);

router.get("/current", getCurrentUser);

router.get("/logout", logout);

/** rutas de auth con github */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/error" }),
  redirectToHome
);
export default router;

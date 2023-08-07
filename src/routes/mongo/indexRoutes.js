import { Router } from "express";
import authRoutes from "./authRoutes.js";
import homeRoutes from "./homeRoutes.js";
import productRoutes from "./productRoutes.js";
import cartRoutes from "./cartRoutes.js";
import chatRoutes from "./chatRoutes.js";

const router = Router();

router.use("/home", homeRoutes);
router.use("/products", productRoutes);
router.use("/carts", cartRoutes);
router.use("/chat", chatRoutes);
router.use("/auth", authRoutes);

router.use("/error", (req, res) => {
  const { errorMessage } = req.flash();
  res.render("error", { errorMessage });
});

router.use("/", (req, res) => {
  res.redirect("/home");
});

router.use("*", (req, res, next) => {
  res.render("notfound");
});
export default router;

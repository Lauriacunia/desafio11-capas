import { Router } from "express";
const router = Router();
import {
  create,
  getAll,
  getProductsOfCart,
  viewCartDetail,
  addProductToCart,
  updateAllProductsOfCart,
  deleteOneProductOfCart,
  deleteAllProductsOfCart,
} from "../../controllers/cart.controller.js";

router.post("/", create);
router.get("/", getAll);
router.get("/:idCart/products", getProductsOfCart);
router.get("/:idCart", viewCartDetail);
router.put("/:idCart/products/:idProduct", addProductToCart);
router.put("/:idCart", updateAllProductsOfCart);
router.delete("/:idCart/products/:idProduct", deleteOneProductOfCart);
router.delete("/:idCart", deleteAllProductsOfCart);

export default router;

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
// vista de detalle de un carrito
router.get("/:idCart", viewCartDetail);
//agregar productos a un carrito
router.put("/:idCart/products/:idProduct", addProductToCart);
// actualizar el array de products del carrito
router.put("/:idCart", updateAllProductsOfCart);
// quitar producto de un carrito
router.delete("/:idCart/products/:idProduct", deleteOneProductOfCart);
// vaciar el carrito de productos
router.delete("/:idCart", deleteAllProductsOfCart);

export default router;

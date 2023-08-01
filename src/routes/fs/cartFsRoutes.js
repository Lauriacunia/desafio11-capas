import { Router } from "express";
const router = Router();
import CartManager from "../../daos/fs/cartManager.js";
const path = "./src/db/carts.json";
const myCartsManager = new CartManager(path);

router.post("/", async (req, res) => {
  /**Crea un carrito vacío de productos */
  try {
    const newCart = req.body;
    const cartCreated = await myCartsManager.addCart(newCart);
    cartCreated
      ? res.status(201).json({
          status: "success",
          payload: cartCreated,
        })
      : res.json({
          status: "error",
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  /**Devuelve todos los carritos */
  try {
    const allCarts = await myCartsManager.read();
    allCarts
      ? res.status(200).json({
          status: "success",
          payload: allCarts,
        })
      : res.status(200).json({
          status: "success",
          payload: [],
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/:idCart/products", async (req, res) => {
  /**Devuelve los productos de un carrito por id */
  try {
    const idCart = req.params.idCart;
    const allCarts = await myCartsManager.read();
    const cart = allCarts.find((cart) => cart.id == idCart);
    cart
      ? res.status(200).json({
          status: "success",
          payload: cart.products,
        })
      : res.status(404).json({
          status: "error",
          message: "Sorry, no cart found by id: " + idCart,
          payload: {},
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.put("/:idCart/products/:idProduct", async (req, res) => {
  /**Agrega un producto al carrito */
  try {
    const idCart = req.params.idCart;
    const idProduct = req.params.idProduct;
    const cartUpdated = await myCartsManager.addProductToCart(
      idCart,
      idProduct
    );
    cartUpdated
      ? res.status(200).json({
          status: "success",
          payload: cartUpdated,
        })
      : res.status(404).json({
          status: "error",
          message: "Sorry, could not add product to cart",
          payload: {},
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

export default router;

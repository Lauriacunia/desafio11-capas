import fs from "fs";
import ProductManager from "./productManager.js";
const pathProducts = "src/db/products.json";
const myProductManager = new ProductManager(pathProducts);

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async addCart() {
    const allCartsArray = await this.read();
    const nextId = await this.getNextId(allCartsArray);
    const newCart = {
      id: nextId,
      products: [],
    };
    allCartsArray.push(newCart);
    await this.write(allCartsArray);
    return newCart;
  }

  async addProductToCart(idCart, idProduct) {
    const allCartsArray = await this.read();
    /**Busco el carrito a actualizar */
    const cartToUpdate = allCartsArray.find((cart) => cart.id == idCart);
    console.log("cartToUpdate", cartToUpdate);
    if (!cartToUpdate) {
      return {
        status: "error",
        message: "Sorry, no cart found by id: " + idCart,
        payload: {},
      };
    }
    /**Busco el producto a agregar. Tiene que existir en mi lista de products.json */
    const allProductsArray = await myProductManager.read();
    const productToAdd = allProductsArray.find(
      (product) => product.id == idProduct
    );
    if (!productToAdd) {
      return {
        status: "error",
        message: "Sorry, no product found by id: " + idProduct,
        payload: {},
      };
    }
    /**Agrego el producto al carrito */
    /**verifico si el producto ya existe en el carrito */
    const productAlreadyInCart = await this.findProductInCart(
      cartToUpdate,
      idProduct
    );

    if (productAlreadyInCart) {
      const index = cartToUpdate.products.indexOf(productAlreadyInCart);
      /**Altualizo el producto en el carrito */
      const productData = {
        id: productAlreadyInCart.id,
        quantity: productAlreadyInCart.quantity + 1,
      };
      cartToUpdate.products[index] = productData;
      /**Actualizo el carrito en el array de carritos*/
      const indexCart = allCartsArray.indexOf(cartToUpdate);
      allCartsArray[indexCart] = cartToUpdate;
      await this.write(allCartsArray);
      return cartToUpdate;
    }
    /**si el producto no existe lo agrego */
    const productData = {
      id: productToAdd.id,
      quantity: 1,
    };
    cartToUpdate.products.push(productData);
    /**Actualizo el archivo carts.json */
    const index = allCartsArray.indexOf(cartToUpdate);
    allCartsArray[index] = cartToUpdate;
    await this.write(allCartsArray);
    return cartToUpdate;
  }

  async findProductInCart(cartToUpdate, idProduct) {
    return cartToUpdate.products.find((product) => product.id == idProduct);
  }

  async read() {
    let allCartsArray = [];
    try {
      let allCartsString = await fs.promises.readFile(this.path, "utf-8");
      allCartsString.length > 0
        ? (allCartsArray = JSON.parse(allCartsString))
        : (allCartsArray = []);
    } catch (err) {
      console.log("Error en la lectura del archivo", err);
    }
    return allCartsArray;
  }

  async write(allCartsArray) {
    let allCartsString = JSON.stringify(allCartsArray);
    try {
      await fs.promises.writeFile(this.path, allCartsString);
    } catch (err) {
      console.log("Error en la escritura", err);
    }
  }

  async getNextId(allCartsArray) {
    let lastId = 0;
    // recorro allCartsArray y guardo todos los ids en un array nuevo. Luego busco el máximo
    const allIdsArray = allCartsArray.map((product) => product.id);
    // me quedo solo con los id numericos, elimino los NaN, null y undefined
    allIdsArray.filter((id) => typeof id === "number");
    if (allIdsArray.length > 0) {
      lastId = Math.max(...allIdsArray);
    }
    return lastId + 1;
  }
}

export default CartManager;

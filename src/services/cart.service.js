import cartModel from "../repository/mongo/models/cart.model.js";
import BaseService from "./base.service.js";

class CartService extends BaseService {
  constructor() {
    super(cartModel);
  }

  // sobreescribe el metodo getAll de la clase padre
  async getAll() {
    // traer el carrito con los productos usando populate
    const carritos = await this.db.find({}).populate({
      path: "products",
      populate: { path: "_id", model: "products" },
    });
    return carritos;
  }

  async getOne(id) {
    try {
      const one = await this.db.findById(id).populate({
        path: "products",
        populate: { path: "_id", model: "products" },
      });
      return one;
    } catch (err) {
      throw new Error(err);
    }
  }

  async addProduct(cart, product) {
    // chequear si el producto ya esta en el carrito
    const allProducts = cart.products;
    const productExists = allProducts.find(
      (p) => p._id._id.valueOf() == product._id.valueOf()
    );
    if (productExists) {
      productExists.quantity++;
    } else {
      cart.products.push({ _id: product._id, quantity: 1 });
    }
    const cartUpdated = await this.db.findByIdAndUpdate(cart._id, {
      products: cart.products,
    });
    return cartUpdated;
  }

  async addManyOfTheSameProduct(cart, product, quantity) {
    const allProducts = cart.products;
    const productExists = allProducts.find(
      (p) => p._id._id.valueOf() == product._id.valueOf()
    );
    if (productExists) {
      productExists.quantity = quantity;
    } else {
      cart.products.push({ _id: product._id, quantity: quantity });
    }
    const cartUpdated = await this.db.findByIdAndUpdate(cart._id, {
      products: cart.products,
    });
    return cartUpdated;
  }

  async removeProduct(cart, product) {
    const allProducts = cart.products;
    if (allProducts.length == 0) throw new Error("El carrito está vacío");
    const productExists = allProducts.find(
      (p) => p._id._id.valueOf() == product._id.valueOf()
    );
    if (productExists) {
      productExists.quantity > 1
        ? (productExists.quantity -= 1)
        : (cart.products = allProducts.filter(
            (p) => p._id._id.valueOf() != product._id.valueOf()
          ));
    } else {
      throw new Error("El producto no está en el carrito");
    }
    const cartUpdated = await this.db.findByIdAndUpdate(cart._id, {
      products: cart.products,
    });
    return cartUpdated;
  }

  async emptyCart(cart) {
    const cartUpdated = await this.db.findByIdAndUpdate(cart._id, {
      products: [],
    });
    return cartUpdated;
  }

  async updateProductsOfOneCart(cart, products) {
    const cartUpdated = await this.db.findByIdAndUpdate(cart._id, {
      products: products,
    });
    return cartUpdated;
  }
}

export default new CartService();

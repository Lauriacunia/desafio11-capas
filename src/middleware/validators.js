import ProductManager from "../daos/fs/productManager.js";
const path = "src/db/products.json";
const myProductManager = new ProductManager(path);

const validateRequest = (req, res, next) => {
  const keysBody = Object.keys(req.body);
  console.log("keysBody", keysBody);
  //verificar que title,description,code, price, stock y category existan en la request
  const requiredKeys = [
    "title",
    "description",
    "code",
    "price",
    "stock",
    "category",
  ];
  const isValidRequest = requiredKeys.every((key) => keysBody.includes(key));
  if (!isValidRequest) {
    res.status(400).json({
      status: "error",
      payload: "Invalid request body. Missing Fields",
    });
    return;
  }
  next();
};

const validateCodeNotRepeated = async (req, res, next) => {
  const { code } = req.body;
  const allProducts = await myProductManager.getProducts();
  const product = allProducts.find((product) => product.code == code);
  if (product) {
    res.status(400).json({
      status: "error",
      payload: "Invalid request body. Code already exists: " + code,
    });
    return;
  }
  next();
};

const validateNumberParams = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    res.status(400).json({
      status: "error",
      payload: "Invalid id: " + id,
    });
    return;
  }
  next();
};

export { validateRequest, validateNumberParams, validateCodeNotRepeated };

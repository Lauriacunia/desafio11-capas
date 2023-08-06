import { Router } from "express";
import {
  viewAll,
  create,
  getOne,
  update,
  deleteOne,
} from "../../controllers/product.controller.js";
import { MongoDBProducts } from "../../daos/mongo/MongoDBProducts.js";
const db = new MongoDBProducts();
import { validateRequest } from "../../middleware/validators.js";
import multer from "multer";
/**Multer config */
// 'photo' es el nombre del campo en el formulario.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const router = Router();
router.use(multer({ storage }).single("thumbnail"));

/**Rutas */
router.get("/", viewAll);

router.get("/:id", getOne);

router.post("/", validateRequest, create);

router.put("/:id", validateRequest, update);

router.delete("/:id", deleteOne);

export default router;

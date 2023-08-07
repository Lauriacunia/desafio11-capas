import { Router } from "express";
import {
  viewAll,
  create,
  getOne,
  update,
  deleteOne,
} from "../../controllers/product.controller.js";
import { validateRequest } from "../../middleware/validators.js";

const router = Router();

/**Rutas */
router.get("/", viewAll);
router.get("/:id", getOne);
router.post("/", validateRequest, create);
router.put("/:id", validateRequest, update);
router.delete("/:id", deleteOne);

export default router;

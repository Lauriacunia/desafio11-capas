import { Router } from "express";
const router = Router();
import { isAuth } from "../../auth/passport-local.js";
import { viewHome } from "../../controllers/home.controller.js";

router.get("/", isAuth, viewHome);

export default router;

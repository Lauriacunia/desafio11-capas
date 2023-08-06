import { Router } from "express";
const router = Router();
import { viewChat } from "../../controllers/chat.controller.js";

router.get("/", viewChat);

export default router;

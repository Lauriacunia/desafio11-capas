import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  try {
    res.render("chat");
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

export default router;

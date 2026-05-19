import { Router } from "express";
import { getState } from "../db/data";

const router = Router();

router.get("/stats", (req, res) => {
  res.json(getState());
});

export default router;

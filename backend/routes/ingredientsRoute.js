import express from "express";
import { analyzeIngredients } from "../controllers/ingredientsController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), analyzeIngredients);

export default router;
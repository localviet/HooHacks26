import express from "express";
import { analyzeIngredients } from "../controllers/ingredientsController.js";

const router = express.Router();

router.post("/", analyzeIngredients);

export default router;
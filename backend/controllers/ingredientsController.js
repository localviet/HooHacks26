import { getIngredientsFromGemini } from "../services/geminiService.js";

export async function analyzeIngredients(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image or ingredients provided." });
    }

    const result = await getIngredientsFromGemini({
      imageFile: req.file
    });

    return res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze ingredients." });
  }
}
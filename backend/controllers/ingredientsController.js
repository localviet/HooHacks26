import { getIngredientsFromGemini } from "../services/geminiService.js";

export async function analyzeIngredients(req, res) {
  try {
    console.log("body:", req.body);
    console.log("file:", req.file);
    const manualIngredients = req.body.manualIngredients || "";
    
    if (manualIngredients && !req.file) {
        const ingredients = manualIngredients
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);

        return res.json({ ingredients });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image or ingredients provided." });
    }

    const result = await getIngredientsFromGemini({
      imageFile: req.file,
      manualIngredients,
    });

    return res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze ingredients." });
  }
}
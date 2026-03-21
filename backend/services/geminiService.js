import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getIngredientsFromGemini({ imageFile, manualIngredients }) {
    const base64Image = imageFile.buffer.toString("base64");
    const mimeType = imageFile.mimetype;

    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
        {
        inlineData: {
            mimeType,
            data: base64Image,
        },
        },
        {
        text: `
    Identify visible food ingredients in this fridge image.
    Return only JSON in this shape and nothing else in the response:
    {
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"]
    }
    Be conservative and only include likely visible edible items.
        `,
        },
    ],
    });
    console.log("Gemini raw response:", response.text);
    const raw = response.text.trim();

    const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

    const parsed = JSON.parse(cleaned);

    const imageIngredients = parsed.ingredients || [];

    const manualList = manualIngredients
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

    const combined = [...imageIngredients, ...manualList];

    const uniqueIngredients = Array.from(
    new Map(combined.map((item) => [item.toLowerCase(), item])).values()
    );

    return { ingredients: uniqueIngredients };
}
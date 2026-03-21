const app = express();

import "dotenv/config";
import express from "express";
import cors from "cors";
import ingredientRoutes from "./routes/ingredientsRoute.js";


const PORT = 5000;
app.use(cors());
app.use(express.json());



//routing
app.use("/api/ingredients", ingredientRoutes)

//app.use("/api/recipes", recipeRoutes)


//run
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
/**
 * Import packages
 */
import express from "express";
import path from "path";

/**
 * Init express
 */

const app = express();

export { app };

/**
 * Middlewares
 */

import "./middleware";

// Public folder
app.use(express.static(path.join(__dirname, "public")));

/**
 * Import routes
 */
import "./routes";
import { PORT } from "./config";

/**
 * Start server
 */
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

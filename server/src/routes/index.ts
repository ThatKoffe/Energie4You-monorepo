/**
 * Register Routes
 */
import { app } from "../app";

import reports from "./reports";
import media from "./media";

app.use("/v1/reports", reports);
app.use("/v1/media", media);

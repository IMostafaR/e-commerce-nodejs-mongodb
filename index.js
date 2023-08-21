import path from "path";
import { config } from "dotenv";
config({ path: path.resolve("config/.env") });
import express from "express";
import { router } from "./src/router.js";

const app = express();
const port = process.env.PORT || 8080;

router(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

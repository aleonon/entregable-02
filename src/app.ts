import express from "express";
import { criaturaRouter } from "./routes/criatura.routes.js";
import { requestId } from "./middlewares/requestId.js";
import { logger } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { AppError } from "./errors/AppError.js";

export const app = express();

app.use(requestId);
app.use(logger);
app.use(express.json({ limit: "10kb" }));

app.use("/api/criaturas", criaturaRouter);

app.use((_req, _res, next) => {
  next(new AppError(404, "Ruta no encontrada."));
});

app.use(errorHandler);

import type { RequestHandler } from "express";
import { validarEntrada } from "../validators/criatura.validator.js";
import { AppError } from "../errors/AppError.js";

export const validarCriatura : RequestHandler = (req, _res, next) => {
    if (!req.is("application/json")) {
        throw new AppError(415, "Usa Content-Type: application/json y un cuerpo JSON.");
    }
    req.body = validarEntrada(req.body);
    next();
}
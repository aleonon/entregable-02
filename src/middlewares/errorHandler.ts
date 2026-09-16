import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError.js";

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
    if (res.headersSent){
        next(error);
        return;
    }

    let statusCode = 500;
    let mensaje = "Error del servidor :p";

    if(error instanceof AppError) {
        statusCode = error.statusCode;
        mensaje = error.message;
    } else if (typeof error === "object" && error !== null && "type" in error) {
        if (error.type === "entity.parse.failed") {
            statusCode = 400;
            mensaje = "El JSON enviado no tiene formato válido.";
        } else if (error.type === "entity.too.large") {
            statusCode = 413;
            mensaje = "El cuerpo de la petición supera el límite de 10KB.";
        } else if (error.type === "charset.unsupported" || error.type === "encoding.unsupported") {
            statusCode = 415;
            mensaje = "La codificación del cuerpo NO está soportada.";
        }
    }

    if (statusCode === 500) {
        console.error(`[${res.getHeader("X-Request-Id")}]`, error);
    }

    res.status(statusCode).json({
        error: {
            mensaje,
            requestId: res.getHeader("X-Request-Id") ?? "sin-id",
        },
    });
};
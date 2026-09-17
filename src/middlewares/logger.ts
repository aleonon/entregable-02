import type { RequestHandler } from "express";

export const logger: RequestHandler = (req, res, next) => {
    const inicio = performance.now();

    res.on("finish", () =>{
        const duracion = (performance.now() - inicio).toFixed(1);
        console.log(
            `[${res.getHeader("X-Request-Id")}] ${req.method} ${req.path} -> ${res.statusCode} (${duracion} ms)`,
        );
    });

    next();
};
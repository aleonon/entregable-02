//server.ts sirve para abrir el puerto [conexión local temporal]

import { app } from "./app.js";

const port = Number(process.env.PORT ?? "3000");
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un entero en el rango 1-65535");
}

const server = app.listen(port, "127.0.0.1", () => {
    console.log(`API lista en http://127.0.0.1:${port}/api/criaturas`);
});

server.on("error", (error) => {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exitCode = 1;
});


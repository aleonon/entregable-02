export class AppError extends Error {
    readonly statusCode: number;

    constructor(statusCode: number, mensaje: string) {
        super(mensaje);
        this.name = "AppError";
        this.statusCode = statusCode;
    }
}
import type { EntradaCriatura } from "../models/criatura.js";
import { AppError } from "../errors/AppError.js";

function esObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function texto(valor: unknown, campo: string, min: number, max: number): string {
    if (typeof valor !== "string") {
        throw new AppError(400, `${campo} debe ser texto.`);
    }
    const limpio = valor.trim();
    if (limpio.length < min || limpio.length > max) {
        throw new AppError(400, `${campo} debe tener entre ${min} y ${max} caracteres.`);
    }
    return limpio;
}

//Esta funcion devuelve un objeto nuevo en base a los datos validados según estos parámetros & exige TODOS los campos en PUT
export function validarEntrada(valor: unknown): EntradaCriatura {
    if (!esObjeto(valor)) {
        throw new AppError(400, "El cuerpo debe ser un objeto JSON.");
    }

    const permitidos = ["nombre", "habitat", "habilidad", "nivel", "amistosa"];
    const extra = Object.keys(valor).find((campo) => !permitidos.includes(campo));
    if (extra !== undefined) {
        throw new AppError(400, `Campo no permitido: ${extra}.`);
    }

    const nombre = texto(valor.nombre, "nombre", 2, 80);
    const habilidad = texto(valor.habilidad, "habilidad", 3, 160);
    const { habitat, nivel, amistosa } = valor;

    if (habitat !== "Pacífico" && habitat !== "Atlántico" && habitat !== "Índico" && habitat !== "Glaciar Ártico" && habitat !== "Glaciar Antártico") {
        throw new AppError(400, "habitat debe ser alguno de los océanos del mundo.");
    }
    if (typeof nivel !== "number" || !Number.isInteger(nivel) || nivel < 1 || nivel > 100) {
        throw new AppError(400, "nivel debe ser un múmero entero entre 1 y 100.");
    }
    if (typeof amistosa !== "boolean") {
        throw new AppError(400, " amistosa debe ser true o false.");
    }

    return { nombre, habitat, habilidad, nivel, amistosa };
}
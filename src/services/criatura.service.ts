import type { Criatura, EntradaCriatura } from "../models/criatura.js";
import { AppError } from "../errors/AppError.js";

let criaturas: Criatura[] = [
    {
        id: 1,
        nombre: "Tiburón cebra",
        habitat: "Pacífico",
        habilidad: "Flexibilidad Extrema",
        nivel: 5,
        amistosa: true,
        creadaEn: "2026-01-01T00:00:00.000Z",
    },
];
let siguienteId = 2;

export function listar(): Criatura[] {
    return criaturas.map((criatura) => ({ ...criatura }));
}

export function obtener(id: number): Criatura{
    const criatura = criaturas.find((item) => item.id === id);
    if(!criatura) {
        throw new AppError(404, `No existe criatura con id ${id}.`);
    }
    return{...criatura};
}

export function crear(datos: EntradaCriatura): Criatura {
    const nueva: Criatura = {
        ...datos,
        id: siguienteId++,
        creadaEn: new Date().toISOString(),
    };
    criaturas.push(nueva);
    return { ...nueva };
}

export function actualizar(id: number, datos: EntradaCriatura): Criatura {
    const existente = obtener(id);
    const actualizada: Criatura = {
        ...datos,
        id: existente.id,
        creadaEn: existente.creadaEn,
    };
    criaturas = criaturas.map((item) => item.id === id ? actualizada : item);
    return { ...actualizada };
}

export function eliminar(id:number): void {
    obtener(id);
    criaturas = criaturas.filter((item) => item.id !== id);
}
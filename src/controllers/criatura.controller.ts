import type { Request, Response } from "express";
import type { EntradaCriatura } from "../models/criatura.js";
import { AppError } from "../errors/AppError.js";
import * as servicio from "../services/criatura.service.js";

type PeticionConDatos = Request<Record<string, string>, unknown, EntradaCriatura>;

function leerId(valor: unknown): number {
    if (typeof valor !== "string" || !/^[1-9]\d*$/.test(valor)){
        throw new AppError(400, "El id debe ser un entero POSITIVO.");
    }

    const id = Number(valor);
    if (!Number.isSafeInteger(id)) {
        throw new AppError(400, "El id está fuera del rango permitido.");
    }
    return id;
}

export function listar(_req: Request, res: Response): void {
    res.status(200).json({ data: servicio.listar() });
}

export function obtener(req: Request, res: Response): void{
    res.status(200).json({ data: servicio.obtener(leerId(req.params.id)) });
}

export function crear(req: PeticionConDatos, res: Response): void {
    const nueva = servicio.crear(req.body);
    res.location(`/api/criaturas/${nueva.id}`);
    res.status(201).json({ data: nueva});
}

export function actualizar(req:PeticionConDatos, res: Response): void {
    const actualizada = servicio.actualizar(leerId(req.params.id), req.body);
    res.status(200).json({ data: actualizada});
}

export function eliminar(req: Request, res: Response): void {
    servicio.eliminar(leerId(req.params.id));
    res.status(204).end();
}
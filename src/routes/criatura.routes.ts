import { Router } from "express";
import * as controlador from "../controllers/criatura.controller.js";
import { validarCriatura } from "../middlewares/validarCriatura.js";

export const criaturaRouter = Router();

criaturaRouter.get("/", controlador.listar);
criaturaRouter.get("/:id", controlador.obtener);
criaturaRouter.post("/", validarCriatura, controlador.crear);
criaturaRouter.put("/:id", controlador.actualizar);
criaturaRouter.delete("/:id", controlador.eliminar);
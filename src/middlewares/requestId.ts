import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

//permite relacionar respuesta con su log
export const requestId: RequestHandler = (
  _req,
  res,
  next
) => {
  res.setHeader("X-Request-Id", randomUUID());
  next();
};
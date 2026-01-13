import crypto from "node:crypto";

import { runWithRequestContext } from "../utils/request-context.js";

const headerName = "x-correlation-id";

export const correlationId = (req, res, next) => {
  const incoming = req.headers[headerName];
  const value = typeof incoming === "string" && incoming.trim()
    ? incoming.trim()
    : crypto.randomUUID();

  req.correlationId = value;
  res.locals.correlationId = value;
  res.setHeader(headerName, value);

  runWithRequestContext({ correlationId: value }, next);
};

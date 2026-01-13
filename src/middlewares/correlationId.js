import { AsyncLocalStorage } from "node:async_hooks";
import crypto from "node:crypto";

const requestContext = new AsyncLocalStorage();

export const runWithRequestContext = (context, fn) => requestContext.run(context, fn);
export const getRequestContext = () => requestContext.getStore() || {};

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

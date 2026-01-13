import crypto from "node:crypto";

const headerName = "x-correlation-id";

export const correlationId = (req, res, next) => {
  const incoming = req.headers[headerName];
  const value = typeof incoming === "string" && incoming.trim()
    ? incoming.trim()
    : crypto.randomUUID();

  req.correlationId = value;
  res.locals.correlationId = value;
  res.setHeader(headerName, value);

  next();
};

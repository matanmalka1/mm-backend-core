import { AsyncLocalStorage } from "node:async_hooks";

const requestContext = new AsyncLocalStorage();

export const runWithRequestContext = (context, fn) =>
  requestContext.run(context, fn);

export const getRequestContext = () => requestContext.getStore() || {};

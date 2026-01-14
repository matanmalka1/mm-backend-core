import mongoSanitize from "express-mongo-sanitize";

const sanitizeTarget = (target) => {
  if (target) {
    mongoSanitize.sanitize(target);
  }
};

// Express 5 exposes req.query as a read-only getter, so sanitize in place.
export const requestSanitizer = (req, res, next) => {
  sanitizeTarget(req.body);
  sanitizeTarget(req.params);
  sanitizeTarget(req.headers);
  sanitizeTarget(req.query);
  next();
};

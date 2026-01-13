// Build a standardized success JSON response.
export const successResponse = (
  res,
  data,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

// Build a standardized error JSON response.
export const errorResponse = (
  res,
  code,
  message,
  statusCode = 500,
  details = null
) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  });
};

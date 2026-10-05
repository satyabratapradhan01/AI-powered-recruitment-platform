/**
 * Consistent API response helper for recruitment platform.
 */

export const successResponse = (res, statusCode = 200, message = '', data = null, extraProps = {}) => {
  const response = {
    status: 'success',
    ...(message && { message }),
    ...(data !== null && { data }),
    ...extraProps,
  };
  return res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode = 400, message = 'An error occurred', error = null) => {
  const status = statusCode >= 500 ? 'error' : 'fail';
  const response = {
    status,
    message,
    ...(error && { error }),
  };
  return res.status(statusCode).json(response);
};

/**
 * Async handler wrapper middleware to catch unhandled errors in async controllers.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

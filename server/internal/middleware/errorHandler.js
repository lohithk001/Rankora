/**
 * Centralized API Error Handling Middleware
 */

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred.';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  console.error(`[API Error] [${req.method} ${req.url}] ${code} - ${message}`, err.stack || err);

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { details: err.stack })
    }
  });
}

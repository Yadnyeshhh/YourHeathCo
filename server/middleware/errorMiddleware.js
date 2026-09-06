const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error for debugging (only in development or for 500s ideally, simple for now)
  if (err.statusCode === 500) {
    console.error('ERROR 💥:', err);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
    error: process.env.NODE_ENV === 'development' ? err : undefined,
  });
};

module.exports = errorMiddleware;

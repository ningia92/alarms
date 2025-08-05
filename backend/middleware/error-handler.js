export const notFound = (req, res, next) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  next(error);
}

export const errorHandler = (err, req, res, next) => {
  const error = {
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500
  };

  console.error(err);

  res.status(error.statusCode).json({ error: { message: error.message, status: error.statusCode } });
}
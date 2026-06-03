function errorHandler(error, _req, res, _next) {
  const status = error.statusCode || error.status || 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  res.status(status).json({
    message: status === 500 ? "Internal server error" : error.message
  });
}

module.exports = {
  errorHandler
};

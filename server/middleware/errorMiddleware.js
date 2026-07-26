const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const isProduction = process.env.NODE_ENV === "production";
  res.status(err.statusCode || 500).json({
    message: isProduction ? "Internal server error" : err.message,
  });
};

export default errorHandler;

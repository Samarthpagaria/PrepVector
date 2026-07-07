const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  
  // Mask the message for 500 errors to prevent leaking internal system details
  const message = statusCode === 500 ? "Internal Server Error" : err.message;

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;

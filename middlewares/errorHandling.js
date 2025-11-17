// Not found error handler middleware
function notFoundError(req, res, next) {
 const error = new Error(`Not Found - ${req.originalUrl}`);

      res.status(404);
      next(error);

}

//error handler middleware
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res
    .status(statusCode)
    .json({
      msg: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
}

module.exports = { errorHandler, notFoundError };

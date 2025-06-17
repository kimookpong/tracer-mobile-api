class Route {
  static errorHandler(app) {
    app.use(this.notFound);
    app.use(this.errorHandle);
  }
  static notFound(req, res, next) {
    const error = new Error(`Not Found`);
    res.status(404);
    next(error);
  }
  static errorHandle(err, req, res, next) {
    //console.error("Error caught:", err);
    const statusCode = err.status || 404;
    res.status(statusCode).json({
      code: statusCode,
      message: err.message || "An unexpected error occurred",
      path:
        process.env.NODE_ENV === "development" ? req.originalUrl : undefined,
      method: process.env.NODE_ENV === "development" ? req.method : undefined,
      timestamp:
        process.env.NODE_ENV === "development"
          ? new Date().toISOString()
          : undefined,
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  static sendResponse = (res, statusCode, data = undefined) => {
    if (!res.headersSent) {
      res.status(statusCode).json({
        code: statusCode,
        message: "ok",
        ...data,
      });
    }
  };
}

module.exports = Route;

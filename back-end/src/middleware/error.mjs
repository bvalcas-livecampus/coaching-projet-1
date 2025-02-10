
const errorHandler = (err, req, res, next) => {
    if (err) {
      res.status(err.status || 500).send({ status: err.status || 500, message: err.message || "Internal Server Error" });
    } else {
      next();
    }
  }

export default errorHandler;
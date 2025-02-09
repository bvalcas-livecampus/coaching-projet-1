
const errorHandler = (err, req, res, next) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      next();
    }
  }

export default errorHandler;
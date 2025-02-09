import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return next(new Error("Unauthorized"));
  jwt.verify(token, process.env.JWT_SECRET);
  next();
};

export default verifyToken;
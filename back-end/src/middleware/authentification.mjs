import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  return next();

  const token = req.headers.authorization;
  if (!token) return next(new Error("Unauthorized"));
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Unauthorized"));
    req.user = decoded;
    next();
  });
};


export default verifyToken;
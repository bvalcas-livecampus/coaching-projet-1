import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  return next();

  const token = req.headers.authorization;
  if (!token) return next({ status: 401, message: "Unauthorized" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next({ status: 401, message: "Unauthorized" });
    req.user = decoded;
    next();
  });
};


export default verifyToken;
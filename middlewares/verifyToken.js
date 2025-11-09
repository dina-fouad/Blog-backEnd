const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ").pop();
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ msg: "invalid token" });
    }
  } else {
    return res.status(401).json({ msg: "Access Denied : no token provided" });
  }
}

function isAdmin(req, res, next) {
  const admin = req.user.isAdmin;

  if (!admin) {
    return res.status(403).json({ msg: "Not allowed , only admin" });
  }
  next();
}
module.exports = { verifyToken, isAdmin };

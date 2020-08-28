const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      message: "You are not authorized to see this!",
    });
  }

  try {
    const decoded = jwt.verify(token, "this is a secret");

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token is invalid!",
    });
  }
};

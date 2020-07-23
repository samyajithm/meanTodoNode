const jwt = require("jsonwebtoken");
const config = require('../config/config');

/*Middleware to verify the jwt token*/
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, config.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(403).json({ message: "Unauthorized Access, Authentication required" });
  }
};

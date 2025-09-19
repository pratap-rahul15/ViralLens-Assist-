const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  // accept the either Authorization header or lower-case header
  const authHeader = req.headers["authorization"] || req.header("Authorization") || "";

  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = { id: decoded.id };

    req.userId = decoded.id;

    next();

  } catch (err) {

    console.error(" authMiddleware error:", err.message);

    return res.status(401).json({ message: "Token is not valid" });
    
  }
};

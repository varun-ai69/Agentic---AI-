const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    const header = String(req.headers?.authorization || "");
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const payload = jwt.verify(token, secret);

    req.auth = {
      userId: payload.sub,
      email: payload.email
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = { requireAuth };

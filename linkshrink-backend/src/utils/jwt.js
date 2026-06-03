const jwt = require("jsonwebtoken");

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  signAccessToken,
  verifyAccessToken
};

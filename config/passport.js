const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("../models/Users");
const auth = require("../helpers/auth");

/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const jwtExtractor = (req) => {
  let token = null;
  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "").trim();
  } else if (req.body.token) {
    token = req.body.token.trim();
  } else if (req.query.token) {
    token = req.query.token.trim();
  }
  if (token) {
    // Decrypts token
    token = auth.decrypt(token);
  }
  return token;
};
/**
 * Options object for jwt middlware
 */
const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: process.env.JWT_SECRET,
};
/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findOne({ where: { id: payload.data.id } });
    return !user ? done(null, false) : done(null, user);
  } catch (error) {
    return done(err, false);
  }
});

passport.use(jwtLogin);

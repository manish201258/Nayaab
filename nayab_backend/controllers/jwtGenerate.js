const jwt = require("jsonwebtoken");
require('dotenv').config()

const tokenGenerate = (id) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set in environment');
    return jwt.sign(
      { id },
      secret,
      {
        expiresIn: "30d"
      }
    );
  } catch (error) {
    console.error('JWT generation error:', error);
    return null;
  }
};

module.exports = tokenGenerate;
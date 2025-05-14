const jwt = require('jsonwebtoken');
const JWT_SECRETS = process.env.JWT_SECRET; // ideally from process.env

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No or malformed token provided' });
  }

  const token = authHeader.split(' ')[1]; // 👈 Extract the actual token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // or decoded.user._id depending on your token payload
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;

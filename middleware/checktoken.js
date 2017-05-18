const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['access-token'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token.' });
    }

    req.decoded = decoded;
    next();
  });
};

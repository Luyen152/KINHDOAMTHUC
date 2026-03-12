// 📁 middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'mysecret';

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không có token. Truy cập bị từ chối!' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== 1) return res.status(403).json({ message: 'Không có quyền truy cập.' });
  next();
};

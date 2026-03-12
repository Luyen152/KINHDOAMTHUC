// 📁 controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userService = require('../service/userService');
const SECRET = process.env.JWT_SECRET || 'mysecret';

exports.register = async (req, res) => {
  const { email, password, name, avatar, role } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    const existingUser = await userService.findByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.create({ email, password: hashedPassword, name, avatar, role });
    res.status(201).json({ message: 'Đăng ký thành công!', user });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Email không tồn tại.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mật khẩu không đúng.' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '1d' });
    res.json({ message: 'Đăng nhập thành công!', token, user });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, name, avatar, role } = req.body;
  try {
    const existingUser = await userService.findByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.create({ email, password: hashedPassword, name, avatar, role });
    res.status(201).json({ message: 'Tạo user thành công!', user });
  } catch (err) {
    console.error('Lỗi tạo user:', err);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, avatar, role } = req.body;
  try {
    const user = await userService.update(id, { name, avatar, role });
    res.json({ message: 'Cập nhật thành công', user });
  } catch (err) {
    console.error('Lỗi cập nhật:', err);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await userService.remove(id);
    res.json({ message: 'Xoá thành công' });
  } catch (err) {
    console.error('Lỗi xoá:', err);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await userService.findById(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.findAll();
    res.json({ users });
  } catch (err) {
    console.error('Lỗi lấy danh sách user:', err);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

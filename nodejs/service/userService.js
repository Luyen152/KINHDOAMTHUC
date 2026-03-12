// 📁 service/userService.js
const pool = require('../db');

exports.findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async ({ email, password, name, avatar, role = 0 }) => {
  const [result] = await pool.query(
    'INSERT INTO users (email, password, name, avatar, role) VALUES (?, ?, ?, ?, ?)',
    [email, password, name, avatar, role]
  );
  return { id: result.insertId, email, name, avatar, role };
};

exports.update = async (id, { name, avatar, role }) => {
  await pool.query('UPDATE users SET name = ?, avatar = ?, role = ? WHERE id = ?', [name, avatar, role, id]);
  return { id, name, avatar, role };
};

exports.remove = async (id) => {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return { id };
};

// ✅ THÊM VÀO ĐÂY
exports.findAll = async () => {
  const [rows] = await pool.query('SELECT id, name, email, avatar, role FROM users');
  return rows;
};

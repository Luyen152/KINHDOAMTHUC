const db = require('../db');

exports.searchProducts = async (keyword) => {
  const [rows] = await db.query(
    `SELECT id, name, slug, image, gia FROM dishes WHERE name LIKE ? ORDER BY created_at DESC LIMIT 10`,
    [`%${keyword}%`]
  );
  return rows;
};

// service/dishService.js
const pool = require('../db');

// Lấy tất cả món ăn
const getAllDishes = async () => {
  const [rows] = await pool.query('SELECT * FROM dishes');

  return rows.map(dish => ({
    ...dish,
    price: dish.gia,  // ✅ THÊM DÒNG NÀY
    is_featured: !!(dish.is_featured && dish.is_featured[0])
  }));
};


// Lấy món ăn theo slug
const getDishBySlug = async (slug) => {
  const [rows] = await pool.query('SELECT * FROM dishes WHERE slug = ?', [slug]);

  if (rows.length === 0) return null;

  return {
    ...rows[0],
    is_featured: !!(rows[0].is_featured && rows[0].is_featured[0])
  };
};

// Tạo món ăn mới
const createDish = async (dish) => {
  const {
    name, slug, description, image,
    category_id, region, difficulty, servings, is_featured
  } = dish;

  const [result] = await pool.query(
    `INSERT INTO dishes 
     (name, slug, description, image, category_id, region, difficulty, servings, is_featured, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [name, slug, description, image, category_id, region, difficulty, servings, is_featured ? 1 : 0]
  );

  return { id: result.insertId, ...dish };
};

// Xoá món ăn
const deleteDish = async (id) => {
  const [result] = await pool.query('DELETE FROM dishes WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// Cập nhật món ăn
const updateDish = async (id, dish) => {
  const {
    name, slug, description, image,
    category_id, region, difficulty, servings, is_featured
  } = dish;

  const [result] = await pool.query(
    `UPDATE dishes SET 
      name = ?, slug = ?, description = ?, image = ?, 
      category_id = ?, region = ?, difficulty = ?, servings = ?, is_featured = ?
     WHERE id = ?`,
    [name, slug, description, image, category_id, region, difficulty, servings, is_featured ? 1 : 0, id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  getAllDishes,
  getDishBySlug,
  createDish,
  deleteDish,
  updateDish
};

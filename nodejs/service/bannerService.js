// service/bannerService.js
const pool = require('../db');

const getAllBanners = async () => {
  const [rows] = await pool.query(
    `SELECT id, title, image, link, position, sort_order, created_at
     FROM banners
     ORDER BY sort_order`
  );
  return rows;
};

const getBannerById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM banners WHERE id = ?`,
    [id]
  );
  return rows[0];
};

const createBanner = async ({ title, image, link, position, sort_order }) => {
  const [result] = await pool.query(
    `INSERT INTO banners (title, image, link, position, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [title, image, link, position, sort_order]
  );
  return result.insertId;
};

const updateBanner = async (id, { title, image, link, position, sort_order }) => {
  await pool.query(
    `UPDATE banners
     SET title = ?, image = ?, link = ?, position = ?, sort_order = ?
     WHERE id = ?`,
    [title, image, link, position, sort_order, id]
  );
};

const deleteBanner = async (id) => {
  await pool.query(
    `DELETE FROM banners WHERE id = ?`,
    [id]
  );
};

module.exports = {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
};

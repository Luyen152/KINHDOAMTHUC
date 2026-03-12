const pool = require('../db');

const menusService = {
  async getMenus() {
    const sql = 'SELECT id, title, url FROM menus ORDER BY sort_order ASC';
    const [rows] = await pool.query(sql);
    return rows;
  },

  async getMenuById(id) {
    const sql = 'SELECT * FROM menus WHERE id = ?';
    const [rows] = await pool.query(sql, [id]);
    return rows.length ? rows[0] : null;
  }
};

module.exports = menusService;

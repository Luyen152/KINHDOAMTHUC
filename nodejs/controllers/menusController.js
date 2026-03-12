// controllers/menusController.js
const menusService = require('../service/menusService');

exports.getMenus = async (req, res) => {
  try {
    const menus = await menusService.getMenus();
    res.status(200).json(menus);
  } catch (error) {
    console.error('Lỗi lấy danh sách menus:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await menusService.getMenuById(id);
    if (!menu) {
      return res.status(404).json({ message: 'Không tìm thấy menu' });
    }
    res.status(200).json(menu);
  } catch (error) {
    console.error('Lỗi lấy menu theo ID:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const dishService = require('../service/dishService');

// GET /dishes - Lấy tất cả món ăn
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await dishService.getAllDishes();
    res.status(200).json(dishes);
  } catch (err) {
    console.error('❌ Lỗi getAllDishes:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// GET /dishes/slug/:slug - Lấy món ăn theo slug
exports.getDishBySlug = async (req, res) => {
  try {
    const dish = await dishService.getDishBySlug(req.params.slug);

    if (!dish) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }

    res.status(200).json(dish);
  } catch (err) {
    console.error('❌ Lỗi getDishBySlug:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// POST /dishes - Tạo món ăn mới
exports.createDish = async (req, res) => {
  try {
    const newDish = await dishService.createDish(req.body);
    res.status(201).json(newDish);
  } catch (err) {
    console.error('❌ Lỗi createDish:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// PUT /dishes/:id - Cập nhật món ăn
exports.updateDish = async (req, res) => {
  try {
    const updated = await dishService.updateDish(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn để cập nhật' });
    }

    res.status(200).json({ message: 'Cập nhật món ăn thành công' });
  } catch (err) {
    console.error('❌ Lỗi updateDish:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// DELETE /dishes/:id - Xoá món ăn
exports.deleteDish = async (req, res) => {
  try {
    const deleted = await dishService.deleteDish(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn để xoá' });
    }

    res.status(200).json({ message: 'Xoá món ăn thành công' });
  } catch (err) {
    console.error('❌ Lỗi deleteDish:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

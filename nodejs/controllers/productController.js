const productService = require('../service/productService');

exports.searchProducts = async (req, res) => {
  const { keyword } = req.query;

  try {
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ error: 'Vui lòng nhập từ khoá tìm kiếm.' });
    }

    const results = await productService.searchProducts(keyword.trim());
    res.json(results);
  } catch (error) {
    console.error('Lỗi tìm kiếm món ăn:', error);
    res.status(500).json({ error: 'Lỗi server khi tìm kiếm món ăn.' });
  }
};

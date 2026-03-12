// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // import pool MySQL trực tiếp

const app = express();
const PORT = process.env.PORT || 5000;

// 1) Middleware
app.use(cors());
app.use(express.json());

app.use('/images', express.static('uploads/images'));

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes); // chuẩn RESTful

const commentRt = require('./routes/comments');
app.use('/api/comments', commentRt);

const menusRoutes = require('./routes/menus');
app.use('/api/menus', menusRoutes);

// server.js
const contactRt = require('./routes/contacts');
app.use('/contacts', contactRt);

const bannerRt = require('./routes/banner');
app.use('/banners', bannerRt);

const dishesRt = require('./routes/dishes');
app.use('/dishes', dishesRt);

const donHangRoutes = require('./routes/donHangRoutes');
app.use('/api/donhang', donHangRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const meRoutes = require('./routes/me'); // 👈 thêm 
app.use('/api/me', meRoutes);

const statsRoutes = require('./routes/stats');
app.use('/api/stats', statsRoutes);






// 3) 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// 4) Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 5) Khởi động server sau khi test kết nối MySQL thành công
async function startServer() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log('✅ MySQL pool ready, starting HTTP server...');
    app.listen(PORT, () => {
      console.log(`🚀 Server chạy trên port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ MySQL connection failed:', err);
    process.exit(1);
  }
}

startServer();






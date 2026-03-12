// // nodejs/routes/me.js
// 'use strict';
// const router = require('express').Router();
// const meController = require('../controllers/meController');

// // Nếu có middleware xác thực sẵn:
// // const { requireAuth } = require('../middleware/auth');
// // router.get('/address', requireAuth, meController.getMyAddress);
// // router.put('/address', requireAuth, meController.putMyAddress);

// // Tạm không bắt buộc auth (đọc id từ query/body):
// router.get('/address', meController.getMyAddress);
// router.put('/address', meController.putMyAddress);

// module.exports = router;




// nodejs/routes/me.js
'use strict';
const router = require('express').Router();
const meController = require('../controllers/meController');

/* ===== ĐỊA CHỈ ===== */
router.get('/address', meController.getMyAddress);
router.put('/address', meController.putMyAddress);

/* ===== ĐƠN HÀNG ===== */
// Xác nhận đã nhận hàng (user/admin đều gọi được)
router.put('/../orders/:id/confirm-delivered', meController.confirmDeliveredByUser);
// Danh sách đơn cho admin (?status=Đã giao ...)
// Lưu ý: mount ở server.js là app.use('/api/orders', require('./routes/me')) cũng được,
// nhưng để đơn giản giữ nguyên file này và map đầy đủ path:
router.get('/../orders/admin/list', meController.adminListOrders);

module.exports = router;

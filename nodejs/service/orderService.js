const db = require('../db');

exports.getAllOrders = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM don_hang', (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.getOrderById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM don_hang WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

exports.updateOrderStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE don_hang SET trang_thai = ? WHERE id = ?', [status, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.deleteOrder = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM don_hang WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// controllers/contactController.js
const contactService = require('../service/contactService');

exports.create = async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const id = await contactService.createContact({ name, email, subject, message });
    res.status(201).json({ message: 'Liên hệ đã được gửi', id });
  } catch (err) {
    console.error('Lỗi tạo liên hệ:', err);
    res.status(500).json({ error: 'Lỗi server khi gửi liên hệ' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const contacts = await contactService.getAllContacts();
    res.json(contacts);
  } catch (err) {
    console.error('Lỗi lấy danh sách liên hệ:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy liên hệ' });
  }
};

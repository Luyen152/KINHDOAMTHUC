// service/contactService.js
const pool = require('../db');

const createContact = async ({ name, email, subject, message }) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
};

const getAllContacts = async () => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM contacts ORDER BY created_at DESC');
    return rows;
  } finally {
    conn.release();
  }
};

module.exports = {
  createContact,
  getAllContacts,
};

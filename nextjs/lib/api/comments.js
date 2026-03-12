// lib/api/comments.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export async function fetchComments() {
  try {
    const response = await axios.get(`${API_BASE_URL}/comments`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API fetchComments:', error.message);
    return [];
  }
}

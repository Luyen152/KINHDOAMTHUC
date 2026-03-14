// lib/api/comments.js
import axios from 'axios';

const API_BASE_URL = 'https://kinhdoamthuc.onrender.com';

export async function fetchComments() {
  try {
    const response = await axios.get(`${API_BASE_URL}/comments`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API fetchComments:', error.message);
    return [];
  }
}
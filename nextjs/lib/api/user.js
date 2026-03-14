import axios from 'axios';

const BASE_URL = 'https://kinhdoamthuc.onrender.com/api/users';

// Gửi thông tin đăng nhập
export const loginUser = (email, password) => {
  return axios.post(`${BASE_URL}/login`, { email, password });
};

// Gửi thông tin đăng ký
export const registerUser = (userData) => {
  return axios.post(`${BASE_URL}/register`, userData);
};

// Lấy thông tin user hiện tại từ token
export const fetchCurrentUser = (token) => {
  return axios.get(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
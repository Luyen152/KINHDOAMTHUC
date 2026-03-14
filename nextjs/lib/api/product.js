import axios from 'axios';

export const searchProducts = async (keyword) => {
  const res = await axios.get(`https://kinhdoamthuc.onrender.com/api/products/search?keyword=${keyword}`);
  return res.data;
};
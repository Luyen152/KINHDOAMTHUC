import axios from 'axios';

export const searchProducts = async (keyword) => {
  const res = await axios.get(`http://localhost:5000/api/products/search?keyword=${keyword}`);
  return res.data;
};

// lib/api/dishes.js
import axios from 'axios';

export const getAllDishes = async () => {
  const res = await axios.get('http://localhost:5000/dishes');
  return res.data;
};

export const getDishBySlug = async (slug) => {
  const res = await axios.get(`http://localhost:5000/dishes/slug/${slug}`);
  return res.data;
};

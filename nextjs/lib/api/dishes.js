// lib/api/dishes.js
import axios from 'axios';

export const getAllDishes = async () => {
  const res = await axios.get('https://kinhdoamthuc.onrender.com/dishes');
  return res.data;
};

export const getDishBySlug = async (slug) => {
  const res = await axios.get(`https://kinhdoamthuc.onrender.com/dishes/slug/${slug}`);
  return res.data;
};
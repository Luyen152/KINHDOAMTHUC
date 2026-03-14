import axios from 'axios';

export const getBanners = async () => {
  const res = await axios.get('https://kinhdoamthuc.onrender.com/api/banners');
  return res.data;
};
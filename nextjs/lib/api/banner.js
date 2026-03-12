import axios from 'axios';

export const getBanners = async () => {
  const res = await axios.get('http://localhost:5000/api/banners');
  return res.data;
};

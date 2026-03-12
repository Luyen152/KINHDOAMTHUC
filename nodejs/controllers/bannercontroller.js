// controllers/bannerController.js
const bannerService = require('../service/bannerService');

exports.list = async (req, res, next) => {
  try {
    const banners = await bannerService.getAllBanners();
    res.json(banners);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const banner = await bannerService.getBannerById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const id = await bannerService.createBanner(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await bannerService.updateBanner(req.params.id, req.body);
    res.json({ message: 'Banner updated' });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await bannerService.deleteBanner(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    next(err);
  }
};

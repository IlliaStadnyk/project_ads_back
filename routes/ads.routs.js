const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const multer = require('multer');
const ad = require('../controllers/ads.controller');
const uploadFile = require('../middlewares/imageUploadWithErrorHandling');

router.get('/ads', ad.getAllAds);
router.get('/ads/:id', ad.getAd);
router.post('/ads', authMiddleware, uploadFile('image'), ad.addAd);
router.delete('/ads/:id', authMiddleware, ad.delete);
router.patch('/ads/:id', authMiddleware, uploadFile('image'), ad.updateAd);
router.get('/ads/search/:searchPhrase', ad.searchAds);

module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../utils/authMiddleware");
const imageUpload = require("../utils/imageUpload");
const multer = require("multer");

const auth = require('../controllers/auth.controller');
const uploadFile = require('../middlewares/imageUploadWithErrorHandling');

router.post('/register', uploadFile('avatar'), auth.register);

router.post('/login', auth.login);
router.get('/user', authMiddleware, auth.getUser);
router.delete('/logout', authMiddleware, auth.logout);

module.exports = router;
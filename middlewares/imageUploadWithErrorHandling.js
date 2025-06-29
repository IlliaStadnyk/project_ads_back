const imageUpload = require('../utils/imageUpload'); // твой multer
const multer = require('multer');

const uploadAvatar = (req, res, next) => {
    imageUpload.single('avatar')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File too large. Max size is 5MB.' });
            }
            return res.status(400).json({ message: 'Multer error: ' + err.message });
        } else if (err) {
            return res.status(400).json({ message: 'Upload error: ' + err.message });
        }

        next();
    });
};

module.exports = uploadAvatar;

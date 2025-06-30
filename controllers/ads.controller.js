const Ad = require('../models/Ad.model');
const User = require('../models/User.model');
const mongoose = require('mongoose');
const getFileType = require('../utils/getImageFileType');
const fs = require("fs");
const path = require("path");


exports.getAllAds = async (req, res) => {
    try {
        const ads = await Ad.find().populate('seller', 'login avatar phone');
        res.status(200).json(ads);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id).populate('seller', 'login avatar phone');
        if (!ad) return res.status(404).json({ message: 'Ad not found' });
        res.status(200).json(ad);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.addAd = async (req, res) => {
    try {

        const { title, description, price, location } = req.body;

        const fileType = req.file ? await getFileType(req.file): 'unknown';
        const userId = req.session?.user?.id;

        if (!title || !description || !price || !location)
            return res.status(400).json({ message: 'Missing fields' });

        if(req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType)){

            const newAd = await Ad.create({
                title,
                description,
                price,
                location,
                image: req.file.filename,
                seller: new mongoose.Types.ObjectId(userId),
                date: new Date(),
            });

            res.status(201).json({ message: 'Ad created', ad: newAd });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.delete = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ message: 'Ad not found' });

        if (ad.seller.toString() !== req.session?.user?.id)
            return res.status(403).json({ message: 'Access denied' });

        fs.unlinkSync(path.join(__dirname, '../public/uploads', ad.image));
        await ad.deleteOne();
        res.status(200).json({ message: 'Ad deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ message: 'Ad not found' });

        if (ad.seller.toString() !== req.session?.user?.id)
            return res.status(403).json({ message: 'Access denied' });

        const { title, description, price, location } = req.body;

        ad.title = title ?? ad.title;
        ad.description = description ?? ad.description;
        ad.price = price ?? ad.price;
        ad.location = location ?? ad.location;

        if (req.file) {
            const fileType = await getFileType(req.file);

            if (!['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ message: 'Unsupported image type' });
            }

            if (ad.image) {
                const oldPath = path.join(__dirname, '..', 'public', 'uploads', ad.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            ad.image = req.file.filename;
        }

        await ad.save();
        res.status(200).json({ message: 'Ad updated', ad });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.searchAds = async (req, res) => {
    try {
        const phrase = req.params.searchPhrase;
        const regex = new RegExp(phrase, 'i');
        const ads = await Ad.find({ title: regex }).populate('seller', 'login avatar phone');

        res.status(200).json(ads);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

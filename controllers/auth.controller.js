const User = require('../models/User.model')
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const Session = require('../models/Session.model')
const getFileType = require('../utils/getImageFileType');

exports.register = async (req, res) => {
    try {
        const {login , password} = req.body;
        const fileType = req.file ? await getFileType(req.file): 'unknown';
        if (login && typeof login === 'string' && password && typeof password === 'string' && req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
            const userWithLogin = await User.findOne({login});
            if (userWithLogin) {
                if (req.file) {
                    fs.unlinkSync(path.join(__dirname, '../public/uploads', req.file.filename));
                }
                res.status(409).json({message:'User already exists'});
            }

            const user = await User.create({ login, password: await bcrypt.hash(password, 10), avatar: req.file.filename});
            res.status(201).json({message:'User created successfully ' + user.login});
        } else {
            res.status(400).send({ message: 'Bad request' });
        }
    } catch(err){
        res.status(500).send({ message: 'Bad request' });
    }

}

exports.login = async (req, res) => {
    try {
        const {login, password} = req.body;
        if (login && typeof login === 'string' && password && typeof password === 'string') {
            const user = await User.findOne({login});
            if (!user) {
                res.status(401).send({message:'Invalid login or Password'});
            } else {
                if (bcrypt.compareSync(password, user.password)) {
                    req.session.user = {
                        id: user._id,
                        login: user.login,
                    };
                    res.status(200).send({message:'Login successfully ' + user});
                } else {
                    res.status(401).send({message:'Invalid login or Password'});
                }
            }

        }
    } catch(err){
        res.status(500).send({ message: 'Bad request' });
    }
}

exports.logout = async (req, res) => {
    try {
        if (process.env.NODE_ENV !== "production") {
            await Session.deleteMany({});
            return res.status(200).json({ message: 'Dev: All sessions cleared' });
        }

        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Logout failed' });
            }
            return res.status(200).json({ message: 'Logged out successfully' });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};


exports.getUser = async (req, res) => {
    if (req.session.user) {
        res.status(200).send({username: req.session.user.login});
    } else {
        res.status(401).send({message:'Unauthorized'});
    }
}
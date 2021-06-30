const CONFIG = require('../../config/config.json');
const TOKEN_SECRET = CONFIG.token.secret;
const TOKEN_EXPIRES = CONFIG.token.expiresInSeconds;
const PRIVATEKEY = CONFIG.serverKey.privateKey;
var debug = require('../../middleware/debug');
var usersSchema = require('../../models/users');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
ObjectID = require("mongodb").ObjectID;
var Users = mongoose.model('users');
var CryptoJS = require("crypto-js");


module.exports = {
    async login(req, res) {
        try{
            if(!req.body.username || !req.body.password) return res.status(401).json({success: false, message: 'Please Enter your username and password'});
            const user = await usersSchema.findOne({username: req.body.username});
            if (user) {
                let checkCredential = user.validPassword(req.body.password);
                if(checkCredential){
                    let find = { _id: user._id };
                    let update = {token: generateJWToken(user.username)};
                    let option = {new: true};
                    await usersSchema.findOneAndUpdate(find, update, option).exec(function (err, user) {
                        if(err){
                            res.status(500).json({success: false, message: 'Err while login' });
                            throw err;
                        } else {
                            res.status(200).json({success: true, user: user});
                        }
                    });
                } else {
                    return res.status(401).json({success: false, message: 'Check Your Credential Again'});
                }
            } else {
                return res.status(401).json({success: false, message: 'Please go register'});
            }
        } catch (e) {
            res.status(500).json({success: false, message: 'Not Authorized'});
        }
    },
    async signUp(req, res) {
        try{
            if(!req.body.username || !req.body.password || !req.body.name) return res.status(401).json({success: false, message: 'All filed are required'});
            const user = await usersSchema.findOne({username: req.body.username});
            if (user) return res.status(409).json({ success: false, message: 'Username is Register Before Try to login'});
            return bcrypt.genSalt(10, function (error, salt) {
                if (error) {
                    res.status(500).json({success: false, message: 'Internal server error'});
                    throw error;
                }
                bcrypt.hash(req.body.password, salt, function (error, hash) {
                    if (error) {
                        res.status(500).json({success: false, message: 'Internal server error'});
                        throw error;
                    }
                    const token = generateJWToken(req.body.username);
                    const body = { username: req.body.username, password: hash, name: req.body.name, token: token};
                    Users.create(body).then(result => {
                        res.status(200).json({success: true, user: result});
                    }).catch(error => {
                        res.status(500).json({success: false, message: 'Internal server error'});
                        throw error;
                    });
                });
            });
        } catch (e) {
            res.status(500).json({success: false, message: 'Not Authorized'});
        }
    },

    async getProfile(req, res) {
        try{
            await usersSchema.findById(req.user._id).select('_id username name image token').exec(function (err, user) {
                res.status(200).json({success: true, user: user});
            });
        } catch (err) {
            res.status(401).json({success: false, message: 'Not Authorized to request User Profile' });
        }
    },

    async changePassword(req, res) {
        try{
            const user = await usersSchema.findById(req.user._id);
            if (user && user.validPassword(req.body.oldPassword)) {
                return bcrypt.genSalt(10, function (error, salt) {
                    if (error) {
                        res.status(500).json({success: false, message: 'Internal server error'});
                        throw error;
                    }
                    bcrypt.hash(req.body.newPassword, salt, function (error, hash) {
                        if (error) {
                            res.status(500).json({success: false, message: 'Internal server error'});
                            throw error;
                        }
                        let find = { _id: req.user._id };
                        let update = {password: hash};
                        let option = {new: true};
                        usersSchema.findOneAndUpdate(find, update, option).then((user) =>{
                            res.status(200).json({success: true, message: 'Profile Has been updated'});
                        }).catch(error => {
                            res.status(500).json({success: false, message: 'Internal server error'});
                            throw error;
                        });
                    });
                });
            }
        } catch (e) {
            res.status(500).json({success: false, message: 'Internal server error'});
        }
    }
};


function generateJWToken(data) {
    return jwt.sign({ username: data }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRES });
}

function encryptPassword (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}


function encrypt(data) {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), PRIVATEKEY).toString();
    } catch (e) {
        return false;
    }
}
function decrypt(data) {
    try {
        let bytes = CryptoJS.AES.decrypt(data, PRIVATEKEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
        return false;
    }
}

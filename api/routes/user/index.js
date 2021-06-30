const express = require('express');
const router = express.Router();
const user = require('../../controllers/user/header');
const controller = require('../../controllers/user/index');

router.post('/signUp', controller.signUp);
router.post('/login', controller.login);
router.get('/getUserProfile', user.isAuthenticated(), controller.getProfile);
router.put('/changePassword', user.isAuthenticated(), controller.changePassword);

module.exports = router;

const usersSchema = require('../../models/users');
const compose = require('composable-middleware');
function isAuthenticated() {
    return compose().use(function (req, res, next) {
        console.log('authorization', req.headers.authorization);
        usersSchema.findOne({ token: req.headers.authorization }).select('_id').exec((err, user) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({success: false, message: 'Authentication failed. Wrong Token.'});
            } else {
                req.user = user;
                next();
            }
        });
    });
}
exports.isAuthenticated = isAuthenticated;

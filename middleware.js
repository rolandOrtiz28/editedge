const dotenv = require('dotenv').config({ override: true });
const User = require('./models/user.js')
const Quotation = require('./models/Quotation');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.gobackTo = req.originalUrl
        return res.redirect('/admin/login')
    }
    next();
}

module.exports.validateArticle = (req, res, next) => {

    const { error } = articleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
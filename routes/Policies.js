const express = require('express');
const router = express.Router();

router.get('/privacy-policy', (req, res) => {
    res.render('policies/privacy-policy', { currentRoute: '/privacy-policy' });

})
router.get('/terms-of-service', (req, res) => {
    res.render('policies/terms-of-service', { currentRoute: '/terms-of-service' });

})
router.get('/refund-policy', (req, res) => {
    res.render('policies/refund-policy', { currentRoute: '/refund-policy' });

})




module.exports = router;
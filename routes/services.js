const express = require('express');
const router = express.Router();

router.get('/videoediting', (req, res) => {
    res.render('services/videoediting', { currentRoute: '/videoediting' });

})


router.get('/3dart', (req, res) => {
    res.render('services/3dart',{ currentRoute: '/3dart' });

})

router.get('/blogger', (req, res) => {
    res.render('blogs/index',{ currentRoute: '/blogger' });

})

router.get('/GraphicDesign', (req, res) => {
    res.render('services/graphicdesign',{ currentRoute: '/GraphicDesign' });

})


router.get('/WebDevelopment', (req, res) => {
    res.render('services/webdevelopment',{ currentRoute: '/WebDevelopment' });

})



module.exports = router;
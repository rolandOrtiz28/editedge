const express = require('express');
const router = express.Router();

router.get('/Video-Editing', (req, res) => {
    res.render('services/videoediting', { currentRoute: '/Video-Editing' });

})


router.get('/3dart', (req, res) => {
    res.render('services/3dart',{ currentRoute: '/3dart' });

})


router.get('/Graphic-Design', (req, res) => {
    res.render('services/graphicdesign',{ currentRoute: '/Graphic-Design' });

})


router.get('/Web-Development', (req, res) => {
    res.render('services/webdevelopment',{ currentRoute: '/Web-Development' });

})

router.get('/Digital-Marketing', (req, res) => {
    res.render('services/degitalmarketing',{ currentRoute: '/Digital-Marketing' });

})



module.exports = router;
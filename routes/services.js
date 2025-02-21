const express = require('express');
const router = express.Router();

router.get('/Video-Editing', (req, res) => {
    res.render('services/videoediting', { currentRoute: '/Video-Editing', title: "Video Editing | EditEdge Multimedia" });

})


router.get('/3dart', (req, res) => {
    res.render('services/3dart',{ currentRoute: '/3dart', title: "3D Art | EditEdge Multimedia" });

})


router.get('/Graphic-Design', (req, res) => {
    res.render('services/graphicdesign',{ currentRoute: '/Graphic-Design', title: "Graphic Design | EditEdge Multimedia" });

})


router.get('/Web-Development', (req, res) => {
    res.render('services/webdevelopment',{ currentRoute: '/Web-Development', title: "Web Development Services | EditEdge Multimedia" });

})

router.get('/Digital-Marketing', (req, res) => {
    res.render('services/degitalmarketing',{ currentRoute: '/Digital-Marketing',title: "Digital Marketing | EditEdge Multimedia" });

})



module.exports = router;
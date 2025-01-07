const express = require('express');
const router = express.Router();

router.get('/videoediting', (req, res) => {
    res.render('services/videoediting');

})


router.get('/3dart', (req, res) => {
    res.render('services/3dart');

})

router.get('/GraphicDesign', (req, res) => {
    res.render('services/graphicdesign');

})


router.get('/WebDevelopment', (req, res) => {
    res.render('services/webdevelopment');

})



module.exports = router;
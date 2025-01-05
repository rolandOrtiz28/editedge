const express = require('express');
const router = express.Router();

router.get('/videoediting', (req, res) => {
    res.render('services/videoediting');

})


router.get('/3dart', (req, res) => {
    res.render('services/3dart');

})



module.exports = router;
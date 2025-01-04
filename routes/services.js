const express = require('express');
const router = express.Router();

router.get('/videoediting', (req, res) => {
    res.render('services/videoediting');

})



module.exports = router;
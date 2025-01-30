const express = require('express');
const router = express.Router();

router.get('/trial', (req, res) => {
    res.render('trial/trial',{ currentRoute: '/trial' });

})

module.exports = router;
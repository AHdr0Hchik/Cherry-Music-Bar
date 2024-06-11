const express = require('express');
const Updater = require('../classes/Updater');

const router = express.Router();

router.get('/update/:version', async (req, res) => {
    await new Updater().downloadAndApplyUpdate(req.params.version);
    return res.redirect('/admin/tables');
});

module.exports = router;


const express = require('express');
const router = express.Router();
const path = require("path");

router.get('/image/product/:id', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/images/products/" + req.params.id));
})

module.exports = router;
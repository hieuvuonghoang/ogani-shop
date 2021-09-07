const mongoose = require('mongoose');

const uomShcema = new mongoose.Schema({
    name: String,
})

const Uom = mongoose.model('Uom', uomShcema);

module.exports = Uom;
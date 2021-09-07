const mongoose  = require('mongoose');

const imageSchema = new mongoose.Schema({
    urlLink: String,
    isActive: String,
})

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
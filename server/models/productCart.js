const mongoose = require('mongoose');

const productCartShcema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dataProductCart: String
})

const ProductCart = mongoose.model('ProductCart', productCartShcema);

module.exports = ProductCart;
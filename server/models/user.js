const mongoose = require('mongoose');

const userShcema = new mongoose.Schema({
    userName: String,
    passWord: String,
    productCart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCart"
    }
})

const User = mongoose.model('User', userShcema);

module.exports = User;
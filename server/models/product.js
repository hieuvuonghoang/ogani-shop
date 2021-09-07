const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    description: String,
    // descriptionShort: String,
    information: String,
    availability: Number,
    uomAvailability: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uom"
    },
    // shipping: String,
    weight: Number,
    uomWeight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uom"
    },
    price: Number,
    // unitMeasurementID: String,
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }],
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    }],
    shortDescription: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
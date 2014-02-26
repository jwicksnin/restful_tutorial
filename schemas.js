mongoose = require("mongoose");
'use strict';

var Schema = mongoose.Schema;

var Sizes = new Schema({
  size: { type: String, required: true},
  available: { type: Number, required: true, min: 0 },
  sku: {
    type : String,
    required : true,
    validate : [/[a-zA-Z0-9]/, 'Product sku should only have letters and numbers']
  },
  price: { type: Number, required: true, min: 0 }
});

var Images = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'catalog', 'detail', 'zoom'],
        required: true
    },
    url: { type: String, required: true }
});

var Variants = new Schema({
    color: String,
    images: [Images],
    sizes: [Sizes]
});

var Categories = new Schema({
    name: String
});

var Catalogs = new Schema({
    name: String
});

module.exports.Sizes = Sizes;
module.exports.Images = Images;
module.exports.Variants = Variants;
module.exports.Categories = Categories;
module.exports.Catalogs = Catalogs;

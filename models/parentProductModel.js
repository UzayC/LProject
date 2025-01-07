const mongoose = require('mongoose');

const ParentProductSchema = new mongoose.Schema({
  name: String,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }
});

const ParentProduct = mongoose.model('ParentProduct', ParentProductSchema);

module.exports = ParentProduct;